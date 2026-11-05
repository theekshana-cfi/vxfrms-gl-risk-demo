# GitHub → Cloudflare Pages

## Access status

GitHub repository: https://github.com/theekshana-cfi/vxfrms-gl-risk-demo. The user created this repository and authorised uploading the prototype. Cloudflare Pages is deployed at https://vxfrms-gl-risk-demo.pages.dev/ and automatically deploys updates pushed to main. Do not paste passwords or API tokens into chat or commit credentials.

## 1. Put the prepared source on GitHub

Sign in to https://github.com/new and create an empty repository named `vxfrms-gl-risk-demo` (private is recommended for source). Do not initialise it with a README because the supplied source already includes one. From this project directory, after extracting the ZIP if applicable:

```sh
git init
git add .
git commit -m "Build synthetic vxFRMS GL risk intelligence prototype"
git branch -M main
git remote add origin https://github.com/theekshana-cfi/vxfrms-gl-risk-demo.git
git push -u origin main
```

If using the existing project folder, it is already committed: skip `git init`, `git add`, `git commit`, and `git branch`. Authenticate using GitHub's normal credential manager or SSH; never embed a token in the remote URL. Alternatively upload the project files through GitHub's Add file → Upload files, retaining the `dist` folder structure.

## 2. Connect Cloudflare Pages

Sign in at https://dash.cloudflare.com/. Open Workers & Pages, create a Pages application and choose Git integration / import an existing Git repository. Select the repository above. Grant repository access only as needed through Cloudflare's official flow.

Use these settings:

| Setting | Value |
| --- | --- |
| Project name | vxfrms-gl-risk-demo |
| Production branch | main |
| Framework preset | None |
| Root directory | repository root (leave default) |
| Build command | `exit 0` |
| Build output directory | `dist` |
| Environment variables | None |

Deploy and use the actual URL returned by Cloudflare. Future pushes to `main` trigger deployment. A private GitHub repository does not make the deployed Pages website private; configure Cloudflare Access separately if audience restrictions are required.

Official documentation checked for this handoff:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

## 3. Verify the deployed demo

Check the demo banner, 241 journals / 7 initial flagged journals, journal drilldown, saving an investigation, threshold changes, CSV exports and reconciliation details. Restore default rules after demonstrating changes. Local browser state is per origin; the cloud URL starts with fresh state.

## Optional direct upload

If Git integration is unavailable, create a Pages Direct Upload project and upload the contents of `dist` (index.html must be at the upload root). Prefer the Git workflow above for repeatable source control. Do not deploy README or tests as the website root.
