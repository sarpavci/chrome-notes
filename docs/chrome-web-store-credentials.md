# Retrieving Chrome Web Store API credentials

The `release` workflow publishes Chrome Notes to the Chrome Web Store via
`wxt submit`, which authenticates against the Chrome Web Store API using three
OAuth 2.0 secrets:

| Secret | What it is |
|---|---|
| `CHROME_CLIENT_ID` | OAuth 2.0 client ID from a Google Cloud project |
| `CHROME_CLIENT_SECRET` | OAuth 2.0 client secret from the same client |
| `CHROME_REFRESH_TOKEN` | Long-lived refresh token minted from that client via the consent flow |

This guide is a reproducible, end-to-end walkthrough for obtaining all three.
You do it **once** per publisher account; the refresh token does not expire as
long as you keep using it and don't revoke access. (The fourth Chrome secret,
`CHROME_EXTENSION_ID`, is just the item ID from the
[Developer Dashboard](https://chrome.google.com/webstore/devconsole) URL and is
not covered here.)

> **Prerequisites:** a Google account that is registered as a
> [Chrome Web Store developer](https://chrome.google.com/webstore/devconsole)
> (one-time $5 registration fee) and that already has the extension item
> created (so you have a `CHROME_EXTENSION_ID`).

---

## Step 1 — Create a Google Cloud project

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. In the project picker (top bar), click **New Project**.
3. Name it something recognizable, e.g. `chrome-notes-publishing`, and create it.
4. Make sure this new project is selected in the project picker before
   continuing.

## Step 2 — Enable the Chrome Web Store API

1. Go to **APIs & Services → Library**
   ([direct link](https://console.cloud.google.com/apis/library)).
2. Search for **Chrome Web Store API**.
3. Open it and click **Enable**.

Without this the token you mint later will be rejected with a
`PERMISSION_DENIED` / "API not enabled" error at submit time.

## Step 3 — Configure the OAuth consent screen

You can't create an OAuth client until the consent screen exists.

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** as the user type, then **Create**.
3. Fill in the minimum required fields:
   - **App name** — e.g. `Chrome Notes Publisher`
   - **User support email** — your account email
   - **Developer contact email** — your account email
4. Save and continue through **Scopes** (no scopes need to be added here) and
   **Test users**.
5. On **Test users**, click **Add Users** and add the **same Google account**
   that owns the extension. This is critical: while the app is in *Testing*
   status, only listed test users can complete the consent flow and mint a
   token. You do **not** need to publish the consent screen or pass
   verification — keeping it in *Testing* is fine for a personal/CI publisher.

## Step 4 — Create the OAuth 2.0 client → `CHROME_CLIENT_ID` + `CHROME_CLIENT_SECRET`

1. Go to **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth client ID**.
3. **Application type:** select **Desktop app**.
   (Desktop-app clients return a refresh token from the manual code-exchange
   flow used below, which is what we want for CI.)
4. Give it a name (e.g. `chrome-notes-ci`) and click **Create**.
5. A dialog shows your **Client ID** and **Client secret**. These are your
   first two secrets:
   - **Client ID** → `CHROME_CLIENT_ID`
   - **Client secret** → `CHROME_CLIENT_SECRET`

   You can re-open these any time from the Credentials list, so it's safe to
   close the dialog.

## Step 5 — Authorize and get the authorization code

Now use the client ID to run the consent flow and get a one-time
**authorization code**.

1. Build this URL, substituting your `CHROME_CLIENT_ID`:

   ```
   https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&access_type=offline&prompt=consent&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_id=YOUR_CHROME_CLIENT_ID
   ```

   Notes on the parameters:
   - `access_type=offline` and `prompt=consent` are what force Google to return
     a **refresh** token (not just an access token). If you omit either, you
     may get a response with no `refresh_token`.
   - `redirect_uri=urn:ietf:wg:oauth:2.0:oob` is the "out of band" / copy-paste
     flow used for desktop clients — it shows the code on screen instead of
     redirecting to a server.

2. Open the URL in a browser **while signed in as the test user / extension
   owner**. Approve the consent screen. (You may see an "unverified app"
   warning because the consent screen is in *Testing* — click **Continue**; it
   is your own app.)
3. Google shows an **authorization code** on the page. Copy it. It is
   single-use and expires within minutes, so do Step 6 right away.

## Step 6 — Exchange the code → `CHROME_REFRESH_TOKEN`

Trade the authorization code for a refresh token with one `curl` call.
Substitute your client ID, client secret, and the code from Step 5:

```bash
curl "https://oauth2.googleapis.com/token" \
  -d "client_id=YOUR_CHROME_CLIENT_ID" \
  -d "client_secret=YOUR_CHROME_CLIENT_SECRET" \
  -d "code=YOUR_AUTHORIZATION_CODE" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
```

The JSON response includes a `refresh_token` field:

```json
{
  "access_token": "ya29....",
  "expires_in": 3599,
  "refresh_token": "1//0g....",
  "scope": "https://www.googleapis.com/auth/chromewebstore",
  "token_type": "Bearer"
}
```

- The value of **`refresh_token`** → `CHROME_REFRESH_TOKEN`.
- Ignore `access_token` — `wxt submit` mints fresh access tokens from the
  refresh token on every run.

> **If `refresh_token` is missing:** Google only returns it on the *first*
> consent for a given client, or when `prompt=consent` forces re-consent.
> Re-run Step 5 with `prompt=consent` in the URL (it's already included above)
> and exchange the new code immediately.

## Step 7 — Add the secrets to GitHub

In the repo, go to **Settings → Secrets and variables → Actions → New
repository secret** and add each of:

- `CHROME_CLIENT_ID`
- `CHROME_CLIENT_SECRET`
- `CHROME_REFRESH_TOKEN`

(Plus `CHROME_EXTENSION_ID` and the Edge secrets — see the
[Publishing section of the README](../README.md#publishing) for the full list.)

## Step 8 — Verify with a dry run

Don't wait for a real release to find out a secret is wrong. Validate them:

1. Go to **Actions → Release → Run workflow**.
2. Set **Dry run** to `true` and run it.

The workflow's guard step fails fast and names any missing secret, then
`wxt submit --dry-run` validates the credentials against the Chrome Web Store
API **without** submitting anything. A green run means all three credentials
are valid.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Token response has no `refresh_token` | Missing `access_type=offline` / `prompt=consent`, or this client already issued one — re-run Step 5 to force re-consent. |
| `invalid_grant` on the code exchange | The authorization code expired or was already used. Get a fresh code (Step 5) and exchange it immediately. |
| `invalid_client` on the code exchange | `CHROME_CLIENT_ID` / `CHROME_CLIENT_SECRET` mismatch, or the client was deleted. |
| `PERMISSION_DENIED` / "API not enabled" at submit | Chrome Web Store API not enabled on the project (Step 2). |
| Consent screen blocks you / "access denied" | The Google account isn't listed as a **Test user** (Step 3) while the consent screen is in *Testing*. |
| `403` referencing the item at submit | The publisher account that minted the token doesn't own `CHROME_EXTENSION_ID`. Use the account that owns the extension. |

## Security notes

- These three values are **account credentials** — anyone holding them can
  publish to your store listing. Store them **only** as GitHub Actions secrets;
  never commit them, never paste them into issues or logs.
- To revoke access, delete the OAuth client in **Google Cloud Console →
  Credentials**, or revoke the app at
  [myaccount.google.com/permissions](https://myaccount.google.com/permissions).
  The refresh token dies with it; mint a new one by repeating Steps 4–6.
