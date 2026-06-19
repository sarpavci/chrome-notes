# Privacy Policy — Chrome Notes

**Last updated:** June 19, 2026

Chrome Notes is a simple note-taking browser extension. This policy explains
exactly what data the extension handles and what it does not. In short: your
notes never leave Google's storage infrastructure, and we have no servers,
accounts, or analytics of any kind.

## What data the extension handles

The only data Chrome Notes processes is the **note text you type** into the
side panel. That is all.

The extension does **not** collect, request, or have access to any of the
following:

- Personal identifiers (name, email, address, phone number)
- Authentication information or passwords
- Your browsing history, the URLs of pages you visit, or page content
- Location data
- Health, financial, or any other sensitive category of information
- Analytics, telemetry, usage metrics, or crash reports

## Where your notes are stored

Your note text is saved using Chrome's built-in
[`chrome.storage.sync`](https://developer.chrome.com/docs/extensions/reference/api/storage)
API. This means:

- Notes are stored by your browser and, if you are signed in to Chrome,
  synchronized across your own devices through your Google account.
- Storage and synchronization are handled entirely by Google's infrastructure
  under [Google's Privacy Policy](https://policies.google.com/privacy).
- **The developer of Chrome Notes operates no servers and never receives,
  sees, or stores a copy of your notes.** There is no backend.

## Data sharing and selling

Chrome Notes does **not** sell, transfer, or share your data with any third
party. Because the extension has no server component and collects no data
beyond what Chrome stores on your behalf, there is nothing to share.

We do not use your data for any purpose unrelated to the single function of
the extension (storing the notes you write), and we do not use it to determine
creditworthiness or for any lending purpose.

## Permissions and why they are needed

Chrome Notes requests the minimum permissions required to function:

| Permission   | Why it is needed                                                       |
| ------------ | ---------------------------------------------------------------------- |
| `storage`    | To save your note text and sync it across your devices via Chrome.     |
| `sidePanel`  | To display the note-taking interface in the browser side panel.        |

The extension makes **no network requests** of its own and contains **no
remote code** — all code is bundled in the published package and reviewed by
the Chrome Web Store.

## Clipboard access

When you click the **Copy** button, the extension writes your current note to
the system clipboard. It only ever *writes* to the clipboard on your explicit
action; it never *reads* clipboard contents.

## Deleting your data

You are in full control of your notes:

- Use the **Clear** button in the extension to erase your note.
- Removing all synced data is also possible through Chrome's settings, or by
  uninstalling the extension and clearing synced extension data from your
  Google account.

## Children's privacy

Chrome Notes is a general-purpose utility and is not directed at children. It
does not knowingly collect any information from anyone, including children.

## Changes to this policy

If this policy changes, the updated version will be published in this file in
the extension's public repository, with a revised "Last updated" date.

## Contact

For questions about this privacy policy, please open an issue on the project
repository:
[github.com/sarpavci/chrome-notes](https://github.com/sarpavci/chrome-notes).
