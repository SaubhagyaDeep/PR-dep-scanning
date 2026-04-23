# PR-dep-scanning

A demo repository for testing OSS dependency scanning tools (grype, trivy) at the PR level.

## Structure

```
demo-app/
├── package.json          # Node.js dependencies (includes intentionally vulnerable versions)
├── package-lock.json     # Locked dependency tree (used by scanners)
└── src/
    ├── index.js          # App entry point
    └── app.js            # Express routes
```

## Vulnerable Dependencies

The `demo-app` intentionally pins older, vulnerable versions of packages to exercise scanner detection:

| Package | Version | Known Issues |
|---------|---------|--------------|
| `axios` | 0.21.1 | SSRF, CSRF, ReDoS (multiple CVEs) |
| `express` | 4.17.1 | Pulls in vulnerable `qs`, `path-to-regexp`, `body-parser` |
| `lodash` | 4.17.20 | Prototype pollution, command injection (CVE-2021-23337) |
| `minimist` | 1.2.5 | Prototype pollution – **critical** (GHSA-xvch-5gv4-984h) |
| `node-fetch` | 2.6.1 | Credential leak to untrusted hosts (GHSA-r683-j2x4-v87g) |
| `path-parse` | 1.0.6 | ReDoS (GHSA-hj48-42vr-x3v9) |

Running `npm audit` inside `demo-app/` should report **12 vulnerabilities** (3 low, 1 moderate, 7 high, 1 critical).

## Scanning with Grype

```bash
# Scan using the package-lock.json
grype dir:./demo-app

# Or scan just the lock file
grype sbom:./demo-app/package-lock.json
```

## Scanning with Trivy

```bash
# Scan the demo-app directory
trivy fs ./demo-app

# Focus on npm vulnerabilities only
trivy fs --security-checks vuln ./demo-app
```

## PR-level Scanning

These tools can be integrated into CI/CD pipelines to scan dependencies on every pull request.
Refer to your CI platform's documentation (e.g., GitHub Actions) for workflow examples.

