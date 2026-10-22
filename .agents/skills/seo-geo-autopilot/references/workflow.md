# SEO-GEO-AUTOPILOT v1

## Mission
Operate an evidence-driven search growth loop:
technical SEO + search intent + content + entity clarity + AI-search visibility +
citation/source analysis + measurement.

Do not optimize for a vanity score. Optimize for concrete, measurable opportunities.

## Modes
- audit: read-only
- plan: audit + research + prioritized plan
- optimize: plan + draft/prepare changes; writes require approval
- autopilot: approved execution may run, but destructive/high-risk actions still stop for approval

Default execution mode: audit. Publication policy: review_before_publish (separate from execution mode).

## Required input
Minimum: domain.
Preferred: market, language, business description, products/services, audience, CMS,
important commercial URLs, known competitors.
If optional integrations are unavailable, continue and record limitations.

## Durable project state
Persist data conforming to schemas/project-state.schema.json:
site_profile, crawl, technical_audit, keyword_universe, serp_observations,
competitors, prompt_matrix, geo_observations, citation_sources, content_inventory,
opportunities, action_queue, execution_log, measurement_baseline, open_questions.

## Master workflow

### A. Discover
Normalize domain; detect CMS; read homepage, navigation, robots.txt and sitemap(s).
Extract brand, products/services, categories, audience, locations and material claims.
Build SITE_PROFILE.

### B. Crawl
Check status codes, indexability, robots, sitemaps, canonicals, titles, meta,
headings, internal links, orphan pages, images/alt, duplicates, structured data,
pagination and performance observations where available.

### C. SEO diagnosis
Classify findings P0/P1/P2/P3. Every actionable finding must include evidence,
affected URLs, impact hypothesis, fix, effort, risk and rollback.

### D. Keyword intelligence
Build keyword/topic universe from site taxonomy, seeds, SERPs, competitors and
customer/problem language. Map each to intent, funnel stage, business relevance,
current/candidate URL, SERP format, demand/competition if sourced, and GEO relevance.
Never fabricate search volume.

### E. Competitor/content gap
Compare competitor coverage for topics, page types, entities, FAQs, evidence,
comparisons, internal links, structured data and observable third-party references.

### F. GEO baseline
Create a stable prompt matrix:
- category/recommendation
- comparison/alternative
- use case/problem
- audience-specific
- trust/evidence
Use brand-free prompts for unbiased visibility where possible.
For each available AI engine record prompt, timestamp, engine/model, brand mention,
competitor mentions, observed position/order, brand claims, citations and limitations.
Never claim an AI answer was obtained unless the tool actually returned it.

### G. Opportunity engine
Create atomic opportunities with:
problem, evidence, asset, action, expected outcome, business impact,
search opportunity, GEO opportunity, confidence, effort, risk, dependencies,
priority and approval requirement.

Optional tie-breaker only: ((business_impact + search_opportunity + geo_opportunity) * confidence) / max(effort,1).
Severity and factual/indexation blockers take precedence. Missing GEO measurements must not zero out SEO fixes; mark unavailable measurements unknown.

### H. Create/optimize
For P0/P1 actions prepare content briefs, titles/meta, headings, entity coverage,
internal links, evidence requirements, FAQs where useful, schema recommendations
and GEO answerability requirements.

Create a new page only when intent is materially distinct and no existing page
satisfies it well. Prefer improving an existing authoritative page when intent matches.

### I. Execute
Use only declared cms_write capabilities. Before each write verify target, snapshot
the current state where possible, record exact change and rollback, apply, verify,
and log. Drafts are allowed; publishing requires approval by default.

Never automatically delete pages, alter DNS, change checkout/payment flows,
perform broad URL migrations, or remove high-traffic content without explicit approval.

### J. QA
Check factual consistency, invented claims, title/meta sanity, headings, links,
canonicals, schema validity, accidental noindex, duplicates/cannibalization,
entity naming and evidence. Critical failure blocks publication.

### K. Measure
Capture available Search Console/analytics data, technical/indexation changes,
ranking observations, AI mention rate, citation domains and conversion observations.
Compare with stored baseline. Do not claim causality without supporting evidence.

### L. Iterate
Turn new measurements, unresolved issues, changed SERPs, new AI answers and new
competitors into the next action queue.

## GEO metrics
mention_rate = prompts_with_brand_mention / valid_prompts.
Also track competitor mention rate, citation-domain frequency/diversity and recurring
brand claims. Preserve prompt text, market, language, engine/model and timestamp for
comparability. A single AI answer is not representative of the whole market.

## Entity rules
Where truthful, make relationships explicit:
brand -> product/service -> category -> audience -> use case -> differentiators.
Prefer clear definitions, specifications, original evidence, useful comparisons,
consistent naming and appropriate schema. Never use hidden text, fake reviews,
fabricated citations or deceptive markup.

## Output contract
Every run returns:
STATUS
WHAT_WAS_CHECKED
WHAT_WAS_FOUND
TOP_OPPORTUNITIES
CHANGES_PREPARED
CHANGES_EXECUTED
QA_STATUS
MEASUREMENT_BASELINE
LIMITATIONS
NEXT_ACTIONS

## Failure handling
Retry safe tool failures once. Record failures. Continue independent work.
Never fabricate missing results. If write permission is absent, prepare a patch/diff.
If sources conflict, preserve both with source/timestamp rather than silently merging.

## Capability routing
Call capability names, not vendor names:
web_search, site_crawl, serp_research, keyword_research, ai_query,
analytics_read, search_console_read, cms_read, cms_write, file_store.

## First run
With only a domain, perform discovery + read-only crawl. Ask at most five high-value
questions only when missing information materially blocks prioritization.

These are agent request examples, not installed shell commands.
Use $seo-geo-autopilot to audit, plan, or prepare optimization for the configured domain.
Monitoring is a single observation unless the user separately requests scheduled automation.
