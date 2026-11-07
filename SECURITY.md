# Security, Provenance & Authorship Protection Policy

## 1. Original Creator Attribution

This repository and all associated assets are the original intellectual creation of:

- **Primary Authors & Engineers:**
  - **Suresh Kishor Savant**
  - **Gahana B G**
- **Team Name:** Code Catalyst (`t2c1-code-catalyst`)
- **Event:** HackToBerFest 2026 — Vidyavardhaka College of Engineering (VVCE)
- **Track:** Web3, AI & Smart Tourism Infrastructure on Solana
- **Original Genesis Repositories:**
  - `https://github.com/HackToBerFest-VVCE/t2c1-code-catalyst`
  - `https://github.com/sureshsavant576-create/project`

---

## 2. Anti-Cloning & Provenance Security Measures

To protect this project from unauthorized cloning, repository plagiarism, and competitive tampering during HackToBerFest 2026, the following security and provenance measures are embedded directly inside the codebase:

### A. Cryptographic Runtime Provenance Guard (`web/lib/provenance.ts`)
- The client application registers a frozen, non-configurable genesis record (`window.__YATRASETU_PROVENANCE__`) upon runtime boot.
- Any attempt to overwrite or delete this global metadata object in the browser runtime fails silently due to `Object.defineProperty` immutability locks.

### B. DevTools Console Certification Badge
- When the web application is loaded in any modern browser, a styled cryptographic certification badge is automatically logged to the developer console (`F12`), verifying:
  - Original Project Name
  - Original Creators: Suresh Kishor Savant & Gahana B G
  - Event: HackToBerFest 2026 (VVCE)
  - Team & Author Provenance Signature

### C. On-Demand Provenance Certificate Modal
- Reviewers and hackathon judges can verify authorship on demand by:
  - Clicking the **`🛡️ Provenance`** button in the footer bar.
  - Pressing keyboard shortcut **`Ctrl + Shift + P`** (or **`Cmd + Shift + P`**).
  - Inspecting `window.__YATRASETU_PROVENANCE__` in browser console.

### D. Stealth HTML & Travel Pass Watermarks
- All generated offline HTML travel passes and exportable PDFs embed an immutable author signature comment:
  `<!-- Certified Origin: Team Code Catalyst (Suresh Kishor Savant, Gahana B G) - HackToBerFest 2026 (VVCE) -->`
- The root layout (`web/app/layout.tsx`) includes author, creator, and publisher metadata tags certifying Team Code Catalyst.

---

## 3. Plagiarism & Unauthorized Clone Reporting

If this project is cloned, re-hosted, or submitted to any hackathon or competition by third parties without explicit authorization:

1. **Verify Integrity:** Run `window.__YATRASETU_PROVENANCE__` in browser console to inspect the genesis fingerprint.
2. **Report Plagiarism:** Contact the HackToBerFest VVCE Organizing Committee with the commit hash history and cryptographic provenance fingerprint.
