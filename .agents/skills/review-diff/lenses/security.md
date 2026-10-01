# Lens: security

Question to hold: **can this code leak a secret, run attacker-controlled content, or show one user's data to another?**

## Look for

- **Secrets**: API keys or tokens in source; secrets in `NEXT_PUBLIC_*` variables (these are bundled into client JS and visible to anyone).
- **HTML injection**: `dangerouslySetInnerHTML` with content not fully under our control.
- **URLs**: `href`, `src`, or `router.push` built from query params or API data without validation — `javascript:` URLs, open redirects after login.
- **Tokens**: auth tokens stored in `localStorage` or `sessionStorage` (readable by any script); tokens sent in URLs.
- **Logging**: user data, tokens, or full API responses logged with `console.*`.
- **Authorization in the UI**: admin-only actions hidden only by UI conditions with no server check implied; user IDs taken from the URL to fetch other users' data without the API enforcing ownership.

## Do not report

- Generic advice ("consider adding CSP") not tied to a line in the diff.
