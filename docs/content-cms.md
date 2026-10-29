# Mulang 内容后台（Payload）

网站与管理后台运行在同一个 Next.js 项目中。后台入口是 `/admin`，旧入口 `/studio` 会跳转到后台。博客正文由 `lib/content/` 读取 Payload，并保留代码中已有文章作为补充。产品目录也接入同一 CMS：产品列表、详情、产品询盘预选、sitemap 和首页分类代表图均读取已发布产品；未发布/删除产品不会从旧静态目录重新露出。

## 销售后台（CRM）

后台左侧分三组：「内容与产品」（产品、文章、话术库、知识库）、「客户与销售」（客户、询盘、订单与样品、跟进记录）、「系统」（用户与权限）。顶部另有两个页面：

- **概览** `/admin`：询盘、客户、产品、文章数量，最新询盘，销售阶段分布，今天该跟进的客户，进行中的样品/大货。
- **CRM 销售看板** `/admin/crm-board`：按销售阶段分列的客户卡片，拖动卡片或用卡片上的下拉框改阶段。

数据规则：

- 官网联系表单每次提交都会存成一条「新询盘」，同时照常发邮件；邮件发送失败但已入库时，访客仍看到提交成功。
- 询盘状态改为「已转客户」且没选客户时，会按询盘信息自动新建客户并关联。
- 跟进记录填写「下次跟进」后，会同步到对应客户的「下次跟进」，概览页按日期提醒（逾期标红）。
- 角色：**管理员**可建同事账号、改角色、删除任何记录；**业务员**可查看和编辑所有 CRM 记录，不能删除、不能改自己或别人的角色。第一个账号自动是管理员；迁移会把已有账号设为管理员。
- 金额、数量、MOQ 等字段只填实际确认的数字；客户资料文件仍放在本机文件夹，「本地资料文件夹」只记录路径，不上传。

导入客户：先整理一份 JSON 列表（`name` 必填，可带 `country`、`productFocus`、`localFolder`、`notes`、`stage` 等字段），放在 Git 忽略的 `data/` 目录，再用管理员账号运行：

```bash
CRM_BASE_URL=https://www.lin6666.top CRM_EMAIL=... CRM_PASSWORD=... npm run crm:import-customers -- data/crm-customers.json
```

脚本通过正常登录调用后台接口，同名客户自动跳过，可以重复运行。账号密码只在命令行临时提供，不写进文件。

本地预览端口不是 3000 时，启动前设置 `CMS_LOCAL_ORIGIN=http://localhost:<端口>`，否则浏览器里的保存请求会因来源不在白名单内被拒绝（403）。

## 编辑与发布

使用原有后台账号登录后，编辑文章并保存草稿。点击发布才会更新公开版本；已发布文章的新草稿不会替换读者正在看的正文或 SEO 字段。首次发布未填写日期时自动补当前时间，未来日期的文章在到期前不出现在公开页面、列表或 sitemap。

后台目前管理文章标题、slug、摘要、分类、阅读时长、已有图片路径、富文本、发布时间、精选及 SEO 字段；产品管理产品名称、SKU、slug、分类、图片路径与图集、简介、规格展示、列表顺序、发布时间及 SEO。图片仍使用网站仓库中的路径或公开 URL，并非上传到 CMS；修改文件名/路径前先确认仓库中图片存在。新增图片上传和找回密码邮件尚未配置；不要把控制台邮件当成已送达邮件。

## 数据库与权限

- 授权目标是 `crazyfries59's Org` 下的 `mulang-apparel-cms`，项目 ref `mqgieansdrkbxfihwlki`，地区 `us-east-1`。Supabase 插件连接的是另一个账号，不能用于该项目的迁移或写入。
- Postgres 使用独立的 `payload` schema。连接池最多 2 个连接，关闭自动推表，TLS 验证 Supabase 公共 CA。公共证书位于 `config/supabase/prod-ca-2021.crt`，随服务函数打包。
- 已执行的数据库迁移须以当前 Preview 部署状态为准。产品目录新增的迁移会为产品、图集、细节图及版本表启用 RLS，拒绝 `PUBLIC`、`anon` 和 `authenticated` 的产品表/序列访问，并只为已有的受限 CMS 角色授予所需数据权限。
- 应用运行用户 `mulang_cms_preview` 只获得 CMS 所需的数据权限，没有建表、清表、创建角色或修改迁移记录的权限。新增数据表的后续迁移需要同时补充 RLS 与运行角色授权。
- 原 SQLite 的 1 个账号、1 篇文章、6 个版本已导入正确云库。保留原账号的密码哈希，不复制会话或重置令牌。原先标为已发布却没有日期的内容按草稿导入，避免未经审阅自动公开；本地数据库和备份保留。

## 配置与部署边界

本轮只部署 Vercel **Preview**，供检查后台和网站；不修改 Production 环境、正式域名或主分支。Preview 后台发布内容只会更新连接此库的预览应用；正式网站仍需单独审阅和部署 CMS 代码后才会使用后台内容。

Preview 仅配置 `DATABASE_URL`（受限运行角色）和随机 `PAYLOAD_SECRET`，不配置 `DATABASE_MIGRATION_URL`。密钥只保存在 Git 忽略的本机环境文件与受保护的 Vercel 设置中，不进入 Git、聊天或项目笔记。CORS/CSRF 仅允许配置的精确 origin，包括 Vercel 当前部署及分支 origin，不使用通配符。

本地启动会优先读取 `.env.local`；当前文件已经指向云库，编辑前应明确目标。需要隔离测试时显式使用独立 SQLite 文件和测试 secret。Vercel 禁止回退到 SQLite，生产构建缺少 `PAYLOAD_SECRET` 会拒绝运行。

## 维护入口

- 安装时的 `postinstall` 会核对固定的 Payload 3.91.0 版本及源码 SHA256，只补回上游初始化探针缺少的 `result.release()`，避免小连接池在事务及文档锁检查时耗尽。补丁脚本为 `scripts/apply-payload-postgres-fix.mjs`；未知版本或源码会拒绝安装，升级 Payload 前应复核并移除已被上游修复的补丁。[上游修复来源](https://github.com/payloadcms/payload/blob/main/packages/db-postgres/src/connect.ts)。
- `lib/database/payload-pg.mjs` 只为原生池增加不含错误详情的 idle 断链日志，不覆盖连接借还、事务、锁或 RLS。`node --test --test-isolation=none tests/payload-postgres-probe.test.mjs` 验证初始化/重连归还、事务独占、错误处理、排空与补丁幂等。
- `npm run db:migrate`：从 `DATABASE_MIGRATION_URL` 读取迁移连接，校验授权项目后运行 `migrations/postgres/`；不要用应用角色迁移。
- `scripts/setup-cms-connection.mjs`：仅监听本机回环地址的密码配置页。已有配置成功时无需再次运行，也不需要重建 Supabase 项目。
- `scripts/import-local-cms.mjs`：只读原 SQLite，目标已有账号或文章时拒绝导入；不会覆盖已有云内容。
- `scripts/provision-cms-runtime.mjs`：准备当前 Preview 的受限运行角色，验证 TLS、权限及数据后保存本机运行连接；不在构建中运行。
- `npm run test:content`：发布规则及询盘字段测试。
- `npm run cms:import-products`：将代码目录中的 241 个当前产品以已发布状态导入 Preview；脚本校验固定项目 ref、拒绝未知 slug 和目标产品覆盖，并在结束时核对公开产品数量。不得将环境切换到 Production。
- `node --test tests/cms-setup.integration.mjs`：配置页的离线安全回归，不使用真实密码或数据库。
- `node tests/cms-cloud.integration.mjs --base-url http://127.0.0.1:3012`：显式运行真实云库及 HTTP 发布回归；仅创建随机 QA 数据，结束后按本次 ID 清理，不发送询盘。

上线验证应覆盖真实登录、匿名访问拒绝、草稿与未来日期隐藏、已发布版本与后续草稿隔离、正文与 SEO、sitemap 以及测试数据清理。迁移成功或旧文章的代码回退成功，都不能单独证明 CMS 已接入。
