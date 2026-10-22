# Tool Contracts

Map the host Agent's tools to these capability names.

For Mulang, resolve the actual mappings and limitations in
`../references/mulang.md` and `../config.project.json` first. These are abstract
contracts, not registered callable tools. Recheck session tools on every run.
The current cms_read route inspects local source only; it does not establish
authenticated read access. cms_write, AI-engine queries, Search Console and
analytics integrations are disabled until separately connected and verified.

## web_search
Input: query, market, language, limit.
Output: title, url, snippet, source.

## site_crawl
Input: url, max_pages, respect_robots.
Output: URL, status, canonical, title, meta, headings, links, indexability,
structured data and crawl timestamp.

## serp_research
Input: query, market, language, device.
Output: observed result URLs/titles/snippets and SERP features.
Never fabricate rank data.

## keyword_research
Input: seeds, market, language, limit.
Output: keyword, intent, volume/difficulty/CPC when sourced, SERP features, source.

## ai_query
Input: engine, prompt, market, language.
Output: engine, model, timestamp, answer, citations.
If citations are unavailable, return [] and record the limitation.

## search_console_read
Return query/page/country/device/date, clicks, impressions, CTR and average position
with source and date range.

## analytics_read
Return page/session/conversion observations with source and date range.

## cms_read
Read pages/products/posts and metadata.

## cms_write
Input must include target ID, exact changes, approval state, before snapshot when
possible, and rollback information. Writes should be idempotent.

## file_store
Persist project state, reports, snapshots and execution logs.

Never emulate a write with a read-only tool.
