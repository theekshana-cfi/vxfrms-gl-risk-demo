# vxFRMS GL Risk Intelligence — synthetic prototype v1.3

Live demo: https://vxfrms-gl-risk-demo.pages.dev/
GitHub: https://github.com/theekshana-cfi/vxfrms-gl-risk-demo

All transactions, identities, counterparties, balances and examples are synthetic. No MBSL data, credentials, APIs or live integrations are used. The application demonstrates proposed capabilities; it is not a verified integration with the production vxFRMS platform.

## Run locally

Open `dist/index.html` in a modern browser, or use HTTP for reliable local storage:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

No dependency installation or build is required. Cloudflare Pages publishes `dist` from GitHub `main`; build command `exit 0`. No environment variables are needed. `_headers` supplies security headers.

## Expanded general ledger

361 deterministic September 2026 journals cover 36 transaction types, 13 categories and 12 branches. Types cover loan disbursement/repayment, lease origination/instalments, hire purchase, savings deposits/withdrawals, fixed deposits/maturities, interest accruals/payments, fees, cash replenishment, payment settlement, interbranch transfers, treasury purchases/income, funding drawdowns/repayments, impairment/write-offs/recovery, payroll, supplier invoices/payments, accruals/prepayments/reversals, asset purchases/depreciation, tax accrual/payment, capital contributions, dividend declarations and suspense clearing.

Every journal has linked debit and credit lines. Repayment examples split principal and interest. Header amount = total journal debits = total journal credits and is counted once in dashboard totals. The primary detection account is shown in the register; drilldown shows every account line. Detection is at journal level using this primary account and journal value, not separate line-level scores. Source systems, source references, counterparties, operators, checker identities and approval statuses are synthetic metadata, not actual interfaces or posting approvals.

Account mappings are simplified accounting illustrations, not MBSL's chart of accounts or approved accounting policy. No complete trial balance, opening balances, tax calculation, foreign exchange, detailed contractual amortisation or financial statements are produced. Interbranch imbalance refers to a separate synthetic counterpart amount, while the local journal itself remains balanced. Reversal counts and inactive days are seeded attributes rather than inferred from a complete historical ledger.

Default fresh-browser results: 8 rule-based journals, 5 statistical journals and 13 Isolation Forest journals. Existing saved rules/model settings may change these counts.

## Detection methods

Seven configurable rule types: amount greater than threshold; hour before 08:00 or at/after closing threshold (Sri Lanka time); dormant days at least threshold; reversal count at least threshold; manual posting in the final two calendar days above amount threshold; matching reference/account/branch/date/amount duplicate count at least threshold; absolute external interbranch counterpart difference above tolerance.

Statistical detection uses 3,360 separate seeded August records: 120 per each of the 28 primary detection accounts. Absolute Z-score uses the account population mean and standard deviation (strict default cutoff 3). IQR uses interpolated quartiles and a default 1.5 fence multiplier. No forecasting or seasonal adjustment is included.

Machine learning is an actual compact JavaScript Isolation Forest fitted in-browser on the separate August baseline, not pre-assigned labels or the scikit-learn package. Defaults: 64 trees, 128 records sampled without replacement per tree, depth 7, seed 1977. Random varying-feature splits isolate points; terminal path lengths include the expected-path-length correction. Score = 2^(-mean path length/c(128)); strict default cutoff 0.62.

Features: log1p(journal amount), Sri Lanka posting hour, log1p(inactivity days), reversal count, counterpart variance ratio, and manual indicator. Account and branch are not ML inputs. Baseline distributions are illustrative and can produce benign signals; the model can miss accounting irregularities found by rules. No production accuracy, recall, fraud probability, model registry or drift control is claimed. Reference: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html

Priority scores are presentation heuristics: rules add 45 per High and 25 per Medium hit, capped at 99; statistics use min(99, round(absolute Z × 15)), High when Z > 5; ML uses round(raw score × 99), High when score > cutoff + 0.08. They are not calibrated across approaches or probabilities. Feature context lists standardized baseline deviations, not causal attribution or SHAP. Method overlap is not independent corroboration.

## Unified investigations and feedback

Open any journal or unmatched reconciliation example to create a case. The unified register links each case to its finding with a unique INV ID. A journal has one case shared across detection methods. Nonflagged journals can have a journal-review case. Assignment records owner and target date; overdue status uses today's Sri Lanka date and excludes Resolved/Closed.

Workflow: New → Assigned → Under Investigation → Pending Clarification → Resolved → Closed, with defined alternative paths and reopening to Under Investigation. Assignment requires an investigator and date; resolving/closing requires a rationale. Notes, supporting evidence at creation, source links, assignment events, transitions and reopening are retained in a timeline. Cases can be searched, filtered and exported to CSV. Closing a reconciliation case does not change its balance variance or mean that the source data has been corrected.

Journal feedback supports Reviewed and False Positive decisions, with required rationale and retained decision history. Reviewed does not close an active case; False Positive closes an existing linked case and records why. Neither decision changes journal lines, removes computed signals, or retrains models. Subsequent investigation can be reopened. No evidence-file upload or external document integration is included.

Previous v1.2 notes are imported into clearly labelled Legacy v1.2 cases, with their original notes preserved. They are not silently attached to new journals reusing similar IDs. The former ledger snapshot and amount are not inferred. Current cases/feedback persist under `vx-investigations-v2`; old storage remains available. Browser state is per-origin and is not synchronised between tabs or users.

## Rule governance and roles

Detection rules supports add, edit, duplicate, enable/disable, delete and individual rule history. Guided templates validate supported thresholds and require business rationale. Impact previews compare rule-based journal membership, independently of dashboard mode. Drafts do not change active detection.

Authors submit their own drafts; Approvers approve/reject another identity's request with rationale. Approval activates a complete rule-set snapshot and increments its version. Stale requests cannot be submitted or approved. Restore proposals use an earlier snapshot to create a new version through approval. History is retained, including deleted definitions.

Demo identities: Author (drafts, investigations), Approver (independent rule review, investigations), Auditor (read-only investigation/governance access), Administrator (author/review but no self-review). All identities can explore model settings in the analytical sandbox. Statistical/ML tuning and investigation closure are outside the independent rule-approval workflow.

Governance is under `vx-governance-v1`, importing prior browser rules as initial approved v1. Audit history records rule changes, approvals, identity switching and investigation actions; CSV export is available. Identities are selectable without login. These controls are a browser-local simulation, not authenticated server authorization, secure separation of duties, shared durable cases or a tamper-proof audit trail.

## Reconciliation scope

Four independent balance snapshots demonstrate a bank fee, interbranch difference, settlement timing and a matched account. They do not derive from the expanded ledger and use exact equality. Transaction-level matching and configurable source-system tolerances are deferred.

## Suggested walkthrough

1. Open General ledger and inspect transaction categories and types. Search "Loan repayment" and open a journal to inspect the three debit/credit lines and balanced totals.
2. Open Risk overview / Exception workbench in Rule-based mode, then GL-10009. Inspect the late suspense journal and detection evidence.
3. Create investigation, assign Demo Analyst A, choose a target date, save assignment, change to Under Investigation and add a note. Set Pending Clarification, then resolve with a rationale, close and reopen.
4. Open the original journal and mark Reviewed or False Positive with rationale. Observe the retained signal, feedback history and linked-case outcome.
5. Open REC-002 and create a reconciliation case. Both origins appear in Investigations; try source/status/owner filters and export.
6. Use Detection Studio to compare statistics and ML. Changes to methods do not duplicate an existing journal case.
7. In Detection rules, preview and save a change draft. Submit as Author, switch to Approver, approve it and inspect versions/audit history. Switch to Auditor to inspect the disabled editing controls.

## Tests

With Node.js 20+:

```sh
node tests/engine.test.cjs
node tests/analytics.test.cjs
node tests/governance.test.cjs
node tests/investigations.test.cjs
```

Checks cover balanced journals and value aggregation, data coverage, all rule types and thresholds, month-end handling, seeded statistical/ML scoring, baseline coverage, governed approvals/staleness/snapshots, case lifecycle, feedback and role restrictions. See VALIDATION.md for observed browser checks.
