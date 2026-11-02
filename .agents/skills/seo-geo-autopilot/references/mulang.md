# 木朗项目适配

核对日期：2026-10-22。每次执行重新读取配置和实际代码，避免把本记录当成永久事实。

- 目标：从海外服装品牌获取合适的 B2B 询盘，不以文章数量或通用 SEO 分数为目标。
- 品牌：Mulang Apparel；不能把工作台中的 Potato Apparel、宏宇及其客户案例自动当作木朗品牌的资质或案例。
- 市场：美国、澳大利亚、瑞士、加拿大、英国、新西兰；网站当前为英文。地区种子不是该地区真实 SERP 或排名证据。
- 当前站点地址来自 `lib/site.ts`：`https://www.mulangapparel.com`。2026-11-02 从 lin6666.top 迁移，旧域名在 Vercel 308 跳转到新域名，Search Console 已提交地址更改。
- Next.js 16 App Router、React 19、TypeScript、Tailwind 4（版本以 `package.json` 为准）；CMS 是 Payload 3（线上用 Supabase Postgres，本地无数据库时回退到代码里的产品与文章），部署在 Vercel。文章、产品都在 Payload 后台管理，Sanity 已不用。
- 网站路由现在在 `app/(site)/`；Payload 在 `app/(payload)/`，读取集合 `collections/Posts.ts`，规范化接口 `lib/content/index.ts`。
- 已有逐页 canonical、Organization/产品/文章 JSON-LD、robots 与 sitemap；优先核查实际输出和内容一致性，避免重复添加。静态抓取工具未显示 JSON-LD 不代表缺失。
- 已发布的 MOQ 指南及 China manufacturer 指南需先盘点，避免为相同搜索意图再造页面。标题清单见本地 `app/(site)/blog/posts.ts`；线上需单独核验。
- 商业页面：首页、products、services、solutions、manufacturing、fabrics、contact；辅助页面：about、technology、portfolio、lookbook、blog。
- CMS 文章字段：title、slug、excerpt、category、readMinutes、coverImage、Lexical body、publishedAt、featured、seo.title、seo.description、_status。不要把普通 Markdown 当作 Lexical JSON 写入。
- 网站公开文章需要 `_status=published` 且 `publishedAt` 已到。未来发布、草稿、CMS 故障与本地回退要分别记录。
- 未经内容确认，不对外发布 MOQ、交期、产能、资质、客户案例或价格；业务工作台数字也需要确认适用于木朗品牌及具体服务。

## 选词规则（2026-11-03 用户确认）

- 新站、权重低：优先**中等搜索量 + 低竞争（低 KD）**的词，不追大词；优先有采购意图的 B2B 词（manufacturer / private label / OEM / custom + 品类）。
- 词源：用户提供候选词，或用户连接 Semrush 后由代理在用户 Chrome 里查询并判断。搜索量和 KD 必须来自 Semrush 实际查询，写明日期和地区数据库，不编造。
- 每个 URL 一个主词；先映射到现有页面（商业页、产品分类、已有文章），意图明显不同才新建文章，避免同义词互相抢排名。

## 当前工具适配

| 能力 | 实际路径及限制 |
|---|---|
| web_search | 当次会话的网页搜索工具；先核实是否可用 |
| site_crawl | 网页读取/浏览器或有界 HTTP 请求，尊重 robots；当前没有独立批量爬虫，不假报覆盖整站 |
| serp_research | 搜索结果仅作观察，不能视为指定地区、设备的精确排名 |
| keyword_research | 用户连接 Semrush 后，在用户的 Chrome 里查词（搜索量、KD、意图），记录日期和数据库（先 US）；未连接时只做定性主题，搜索量/KD 标「未知」 |
| ai_query | 未接入；不得把当前代理回答或普通网页搜索当成外部引擎样本 |
| analytics_read | 未接入 |
| search_console_read | 已验证浏览器内域名资源 mulangapparel.com（旧资源 lin6666.top 已提交地址更改）；可手动读取报告，未接入 API/OAuth；每次重新检查登录状态 |
| cms_read | 当前通过本地源码和用户提供导出读取结构；后台数据库和线上 CMS 内容尚未验证 |
| cms_write | 未接入自动写入；先输出文件草稿/本地补丁；未来接入时逐项记录目标、变更、验证和回滚 |
| file_store | 本地文件工具；报告归 Obsidian，技能入口留在代码仓库 |

首次安装时线上读取失败；后续已通过正式站点 HTTP 验证和 Search Console 浏览器报告核查。站点地图已成功处理，发现 255 个网址；索引报告更新于 2026-10-16，2 个已收录、9 个未收录，不代表当前全站总数。未完成整站爬取或 GEO 测量；最新证据以 Obsidian 项目状态和报告为准。

Google 的 AI 搜索功能仍以基础 SEO、可抓取内容、可靠信息为基础，没有必需的特殊 AI 文件或专用 schema；这不保证任何引擎收录或引用。参考：https://developers.google.com/search/docs/appearance/ai-features 。
