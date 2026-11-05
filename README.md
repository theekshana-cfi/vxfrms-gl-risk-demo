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

## Statistical and machine learning detection (v1.1)

Open Detection studio to compare all three methods, configure settings and inspect cross-method evidence. Use the Detection approach selector on the dashboard or workbench to switch the active results. Case histories remain journal-specific and shared across methods; exports include the selected approach.

Statistical detection uses a separate, seeded August baseline of 600 synthetic records (120 per GL account). Absolute Z-score compares amount with the account population mean and population standard deviation; the default strict cutoff is 3. The alternative IQR method uses interpolated quartiles with a default 1.5 fence multiplier. Neither includes time-series forecasting or seasonal adjustment.

Machine learning detection is a compact JavaScript Isolation Forest, fitted in-browser on the separate August baseline. Defaults: 64 trees, 128 randomly sampled records per tree without replacement, depth limit 7, seed 1977. Each node randomly selects a varying feature and a split between its observed bounds. Terminal path lengths include the standard expected-path-length correction. Score = 2^(-average path length / c(128)); strict default cutoff is 0.62. This is an actual unsupervised fitting/scoring process, not predetermined labels and not the scikit-learn package.

Features: log1p(amount), local posting hour, log1p(inactivity days), reversal count, absolute counterpart variance divided by amount, and manual posting indicator. Amount has no currency mixing because this dataset is all LKR. Account and branch are not ML inputs. The ML baseline includes small counterpart differences, inactivity up to 24 days, and occasional single reversals; it is generated separately from September. These distributions are illustrative and may produce apparent signals from benign distribution differences. The model can miss accounting irregularities detected by rules. No known anomaly labels, accuracy, precision, recall, drift monitoring, model registry or production fraud calibration is claimed.

Statistical priority = min(99, round(absolute Z-score × 15)); High if absolute Z-score > 5, otherwise Medium (including when IQR selected). ML priority = round(raw isolation score × 99); High if raw score exceeds configured cutoff by more than 0.08, otherwise Medium. These are presentation heuristics, are not calibrated across methods, and are not probabilities. ML feature context shows the three largest standardized baseline deviations; it is not causal attribution or SHAP.

Default results: 7 rule-based journals, 4 statistical journals, 2 ML journals, 8 unique journals across all methods. Counts depend on settings. Method overlap is not independent corroboration. Investigators must review the business context.

Run additional tests with `node tests/analytics.test.cjs`. Algorithm reference: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html

## Rule management and governance demonstration (v1.2)

Detection rules now supports Add, Edit, Duplicate, Enable/Disable, Delete and per-rule History. A guided builder supports the seven existing rule types; it does not execute free-form code. Business rationale is required. Preview impact compares before/after rule-based flags on the same synthetic ledger. All changes are proposals; there is no immediate-save bypass.

Use the demo identity selector in the header:
- **Author:** create drafts, submit/discard own drafts, update investigations.
- **Approver:** approve/reject another identity's submitted request; update investigations; cannot author rules.
- **Auditor:** read dashboards, requests, snapshots and audit history; cannot author, approve or save investigations.
- **Administrator:** author and review, but cannot review their own requests.

All identities can explore statistical/ML settings in the analytical sandbox. The approval workflow covers the rule set, not model settings or investigation approvals.

### Suggested walkthrough

1. As Demo Rule Author, open Detection rules → Add rule. Name it “Enhanced high-value review”, choose High-value journal, set threshold 750,000, supply a description and business rationale, and Preview impact (7 → 50 flagged journals with default rules).
2. Save draft. Detection still uses approved v1. Submit for approval; approval actions are disabled for the author.
3. Close the dialog, switch to Demo Approver, open Roles & governance, and inspect the change request. Enter a review rationale and Approve & activate. Approved v2 becomes active and its snapshot is retained.
4. Switch to Auditor. View permission restrictions, per-rule history, version snapshots and the audit export.
5. As Author, propose disabling or deleting a rule. Deletion requires an explicit deletion-draft confirmation, rationale and independent approval. Older snapshots retain the definition.
6. Inspect an earlier version and Propose restore. This creates a fresh draft based on the current version; approval creates a new version rather than overwriting history.

Requests store complete proposed rule-set snapshots. Draft → Pending → Approved/Rejected; authors can discard drafts. Requests based on an older approved version cannot be submitted or approved, preventing lost updates within the demo state; reject stale pending requests and create fresh proposals. Review rationale is mandatory. Approval activates the snapshot and increments the version. Per-rule History derives approved changes from the retained snapshots. Audit events include drafting, submission, approval/rejection, discarding, simulated identity switching and investigation changes.

Governance is saved under `vx-governance-v1` in browser local storage. On first use it imports the current browser's existing rule settings as approved v1. It is per-browser/per-origin, does not sync between users or tabs, and survives reload. Simulated users are selectable without login; browser storage and client code can be edited outside the UI. This is **not server-enforced access control, secure separation of duties or an immutable audit system**. A production implementation needs authenticated identities, server-side authorization and validation, transactional concurrency control, durable version storage and tamper-evident audit records.

Run `node tests/governance.test.cjs` for lifecycle and permission tests.
