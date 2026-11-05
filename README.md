# vxFRMS GL Risk Intelligence — MBSL demonstration

A dependency-free, deployable browser prototype. All 241 journal entries, users, balances and investigation examples are synthetic. No MBSL data, credentials, external APIs, telemetry or live integrations are included. Brand names are used for the requested demonstration; this is not a verified production vxFRMS integration.

## Open locally

Open `dist/index.html` directly in a modern browser, or run from this folder:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Visit http://127.0.0.1:8765. Browser storage behaviour is more reliable over HTTP. Rules and investigations persist in that browser only. No installation or build is required.

## Five-minute demonstration

1. Risk overview: 241 journals, 7 flagged journals and unique flagged journal value. Counts are calculated from the actual rule engine.
2. Open GL-10009: inspect the LKR 4.85M amount and 23:00 posting, including the two matching rule thresholds. Assign Demo Analyst A, choose Investigating and save a note.
3. Exception workbench: filter by Colombo, severity or status; search a journal reference; export the filtered CSV.
4. Detection rules: change the high-value threshold from 2,000,000 to 5,000,000 and Save & run detection. GL-10009 remains flagged for posting hours; its risk score changes. Restore defaults afterwards.
5. General ledger: inspect the full synthetic population and unflagged journals.
6. Reconciliation: inspect REC-002, a LKR 150,000 interbranch variance. Record a finding. Review the bank fee, settlement timing and matched-account examples.

## Detection semantics

Seven enabled/disabled configurable controls: amount greater than threshold; posting hour below 08 or at/after configurable closing hour; inactivity days at least threshold; reversal count at least threshold; manual journal in the last two calendar days above threshold; duplicate reference/account/branch/date/amount count at least threshold; absolute interbranch counterpart difference above tolerance. Posting hours are explicitly Sri Lanka local time. Thresholds and severities are illustrative, not approved accounting controls.

Journal-level risk score = 45 per High rule and 25 per Medium rule, capped at 99. This is an illustrative priority score, not a probability. Journal severity is High when any hit is High. Flagged value counts each flagged journal once and is not estimated loss. Duplicate entries are separate journals and both are counted. Resolution changes case workflow, not whether a rule matches.

The journal register models individual posting records with a debit/credit indicator, not complete balanced double-entry journal lines or a trial balance. Reversal counts and dormant days are seeded attributes. Reconciliation balances are independent illustrative snapshots and are not derived from this register. Reconciliation uses exact equality and shows signed GL-minus-source variance and absolute aggregate variance.

## Required business customisation

GL anomaly detection logic will be custom-developed based on MBSL's specific requirements, accounting practices, transaction characteristics, and the availability and quality of historical and operational data. vxFRMS provides the underlying framework for implementing these capabilities.

Production work includes agreed chart-of-accounts and source mappings, double-entry validation, authorised data ingestion, server-side validation, authentication and access roles, durable case storage, immutable audit records, approvals, rule versioning, calibration and acceptance testing. This demo has no authentication or shared backend. Do not enter real confidential data in investigation notes.

## Tests

With Node.js 20+ installed:

```sh
node tests/engine.test.cjs
```

Tests cover deterministic generation, every seeded rule, disabled controls, amount and tolerance boundaries, duplicate groups, and month-length-sensitive period-end dates. Browser checks are documented in VALIDATION.md.

## Source control and deployment

See DEPLOYMENT.md for GitHub and Cloudflare Pages settings. The `dist` directory is ready for static hosting without dependencies, credentials or environment variables. `_headers` supplies security headers on Cloudflare Pages. No third-party assets are loaded.
