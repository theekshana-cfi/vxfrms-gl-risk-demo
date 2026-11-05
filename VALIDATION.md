# Current validation — v1.3 Priority 1 release

- 361 unique deterministic journals; all journal debits equal credits and header amount equals each side’s total. 741 journal lines, 36 transaction types, 13 categories, 33 used GL accounts and 12 branches.
- Default detection checks: 8 rule-based, 5 statistical and 13 ML flagged journals. 3,360 historical baseline records provide 120 peers for every primary detection account.
- All four suites passed: expanded ledger/rules, statistical/ML, governance, unified investigations.
- Case tests cover one case per source, source separation, assignment and overdue dates, allowed/invalid status transitions, mandatory resolution rationale, reopening, notes, reviewer feedback history, false-positive closure, and Auditor write restrictions.
- Browser verified balanced 2-line suspense and 3-line principal/interest repayment drilldowns, all source/approval metadata, journal case creation, assignment, overdue indication, notes, Pending Clarification, resolution, closure, reopening, false-positive feedback and linked-case closure.
- Browser verified a reconciliation exception creates a separate case in the same register; cases and notes persisted after reload. Legacy notes appeared in a labelled archive rather than attaching to new journals with reused IDs.
- Desktop layout visually inspected. CSV generation is implemented; downloads have not been independently parsed. No new mobile-device pass or production access/security testing is claimed.

Earlier validation history follows; counts and descriptions below refer to previous versions.

# Validation

- JavaScript syntax checked for engine.js and app.js.
- All engine.test.cjs assertions passed in the available Node execution environment: deterministic 241-record population, 7 flagged journals, every seeded rule, disabled controls, strict amount/tolerance boundaries, duplicate grouping, and February period-end dates.
- Browser verified initial dashboard totals and rendered rule evidence for GL-10009.
- Browser saved an assigned investigation and synthetic note, then verified it persisted after page reload.
- Browser changed the amount threshold to 5,000,000, saved and reran detection; seven journals remained flagged because the two formerly high-value journals also match other rules. Defaults restored.
- Browser verified reconciliation totals: four accounts, three unmatched, one matched, LKR 255,000 absolute variance; REC-002 drilldown showed LKR 150,000 difference.
- Dashboard screenshot visually inspected at available browser width. CSS includes small-screen layouts; a separate mobile-device pass was not performed.
- CSV export code and filters implemented; download-file contents were not independently browser-tested.
- GitHub and Cloudflare browser sessions both require sign-in. No live cloud deployment was performed or verified.

## v1.1 statistical and ML update

- Analytics tests passed for baseline dates/count, quantile calculation, seeded repeatability, finite score range, exact strict score boundary, sensitivity monotonicity, IQR detection, alternative tree counts and scoring independence from the other September evaluation records.
- Local browser verified the Detection Studio default comparison (7 rules / 4 statistical / 2 ML / 8 unique), ML exception drilldown and raw score evidence, method switching, and sensitivity changes (ML cutoff 0.55 yields 96 flagged journals).
- Studio layout visually inspected. No calibrated performance evaluation is claimed on synthetic data.

## v1.2 governance update

- Governance tests passed: role-based author/reviewer restrictions, own-draft submission, required rationale, independent approval (including Administrator self-review prevention), active-rule isolation from drafts, replay rejection, stale-version conflicts, rejection without activation, version snapshot retention, deletion history, discard transitions and threshold validation.
- Local browser verified Add → impact preview (7 to 50) → Save draft → Submit → author approval disabled → identity switch → independent approval → Approved result. Role matrix, request list, version 1 snapshot and audit events rendered.
- Rule and analytical engines remain separate from governance and approved rules feed the existing detection flow. This is a browser-local permission simulation; no production security claim is made.
