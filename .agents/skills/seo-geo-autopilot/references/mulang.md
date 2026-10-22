# 木朗项目适配

核对日期：2026-10-22。每次执行重新读取配置和实际代码，避免把本记录当成永久事实。

- 目标：从海外服装品牌获取合适的 B2B 询盘，不以文章数量或通用 SEO 分数为目标。
- 品牌：Mulang Apparel；不能把工作台中的 Potato Apparel、宏宇及其客户案例自动当作木朗品牌的资质或案例。
- 市场：美国、澳大利亚、瑞士、加拿大、英国、新西兰；网站当前为英文。地区种子不是该地区真实 SERP 或排名证据。
- 当前站点地址来自 `lib/site.ts`：`https://www.lin6666.top`。`mulangapparel.com` 只是历史候选，未确认购买，不迁移 DNS 或 canonical。
- Next.js 16.2.7 App Router、React 19.2.4、TypeScript、Tailwind 4；本地 Payload 3.89 + SQLite 是原型，尚未部署，线上历史版本使用 Sanity。每次重新确认线上与本地 CMS。
- 网站路由现在在 `app/(site)/`；Payload 在 `app/(payload)/`，读取集合 `collections/Posts.ts`，规范化接口 `lib/content/index.ts`。
- 已有逐页 canonical、Organization/产品/文章 JSON-LD、robots 与 sitemap；优先核查实际输出和内容一致性，避免重复添加。静态抓取工具未显示 JSON-LD 不代表缺失。
- 已发布的 MOQ 指南及 China manufacturer 指南需先盘点，避免为相同搜索意图再造页面。标题清单见本地 `app/(site)/blog/posts.ts`；线上需单独核验。
- 商业页面：首页、products、services、solutions、manufacturing、fabrics、contact；辅助页面：about、technology、portfolio、lookbook、blog。
- CMS 文章字段：title、slug、excerpt、category、readMinutes、coverImage、Lexical body、publishedAt、featured、seo.title、seo.description、_status。不要把普通 Markdown 当作 Lexical JSON 写入。
- 网站公开文章需要 `_status=published` 且 `publishedAt` 已到。未来发布、草稿、CMS 故障与本地回退要分别记录。
- 未经内容确认，不对外发布 MOQ、交期、产能、资质、客户案例或价格；业务工作台数字也需要确认适用于木朗品牌及具体服务。

## 当前工具适配

| 能力 | 实际路径及限制 |
|---|---|
| web_search | 当次会话的网页搜索工具；先核实是否可用 |
| site_crawl | 网页读取/浏览器或有界 HTTP 请求，尊重 robots；当前没有独立批量爬虫，不假报覆盖整站 |
| serp_research | 搜索结果仅作观察，不能视为指定地区、设备的精确排名 |
| keyword_research | 从真实服务与搜索结果提取主题；搜索量、CPC、难度未知 |
| ai_query | 未接入；不得把当前代理回答或普通网页搜索当成外部引擎样本 |
| analytics_read / search_console_read | 未接入；有用户授权导出或可用连接器后才启用 |
| cms_read | 当前通过本地源码和用户提供导出读取结构；后台数据库和线上 CMS 内容尚未验证 |
| cms_write | 未接入自动写入；先输出文件草稿/本地补丁；未来接入时逐项记录目标、变更、验证和回滚 |
| file_store | 本地文件工具；报告归 Obsidian，技能入口留在代码仓库 |

本次线上首页、robots、sitemap 读取失败；本地 HTTP 重试报 SSL 连接失败。没有完成线上爬取、收录检查或 GEO 测量。

Google 的 AI 搜索功能仍以基础 SEO、可抓取内容、可靠信息为基础，没有必需的特殊 AI 文件或专用 schema；这不保证任何引擎收录或引用。参考：https://developers.google.com/search/docs/appearance/ai-features 。
