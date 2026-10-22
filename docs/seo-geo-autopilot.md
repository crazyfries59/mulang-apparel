# 木朗 SEO/GEO 技能

项目技能入口：`.agents/skills/seo-geo-autopilot/SKILL.md`；项目配置：同目录 `config.project.json`。

来自用户提供的 SEO-GEO-AUTOPILOT v1 压缩包，经项目适配后安装。它是代理工作流，运行时由代理读取配置和模板，不是 Next.js 插件、CLI 或自动发文服务；不增加 npm 依赖。Codex 按仓库技能目录发现入口；未显示时重新打开会话或重启。Claude Code / WorkBuddy 的专用入口本次未安装。

可直接说：

- `使用 $seo-geo-autopilot 审计木朗官网，把报告保存到 Obsidian。`
- `使用 $seo-geo-autopilot 规划 private label clothing manufacturer 的页面优化，先检查是否已有同意图页面。`
- `使用 $seo-geo-autopilot 为现有 MOQ 指南准备优化草稿。`

执行模式为 `audit / plan / optimize / autopilot`；当前默认 `audit`，发布政策独立为 `review_before_publish`。只安装配置不代表授权持续运行、CMS 写入或发布业务内容。当前无定时任务；无需为技能本身部署 Vercel。

已配置品牌、现有域名、海外目标市场、商业页面、主题种子、Obsidian 路径、实际工具路由和限制。当前搜索/页面读取由会话工具承担，CMS 只读取本地结构；Search Console、流量统计、外部 AI 查询、自动 CMS 写入均未接入，不能生成对应的真实指标。配置不含账号、密钥或密码。

本地站点正在从 Sanity 改为 Payload，SQLite 仅用于本地原型，线上与本地要分别核实。后续正式 CMS 接入前，不进行自动写库；Markdown 草稿不能直接当作 Payload Lexical 正文。

完整评估、原包备份和初始状态归档至 `C:/A/obsidian本地仓库/项目/Mulang服装外贸/SEO-GEO/`，入口笔记为 `SEO-GEO技能评估与安装-2026-10-22.md`。本次只验证安装和配置，未完成整站 SEO 审计或线上 GEO 测量。

回滚：移除本次新增的技能目录和本文档即可；无需回退网站页面、CMS 数据或依赖。已经归档的报告可保留。
