# Mulang 内容后台（Payload）

网站与管理后台运行在同一个 Next.js 项目中。后台入口是 `/admin`，旧入口 `/studio` 会跳转到后台。博客正文由 `lib/content/` 读取 Payload，并保留代码中已有文章作为补充。产品目录也接入同一 CMS：产品列表、详情、产品询盘预选、sitemap 和首页分类代表图均读取已发布产品；未发布/删除产品不会从旧静态目录重新露出。

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
