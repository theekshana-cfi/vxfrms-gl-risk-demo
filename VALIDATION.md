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
