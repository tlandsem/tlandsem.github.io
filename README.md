# trinelandsem.no

Personal portfolio website for Trine Landsem — cybersecurity student — built with HTML, CSS and JavaScript, published with Jekyll on GitHub Pages.

## About
A cyberpunk-themed personal portfolio featuring an animated network background, falling glyphs and moving data packets.
The Labs page shows TryHackMe progress generated from synced profile data, and certifications are listed on both About me and Labs from a shared data file.
The site also hosts an online version of my guide on safe use of AI in kindergartens (Norwegian).

## Pages
- **Home** — Landing page
- **News** — Latest updates and announcements
- **About me** — Background, experience, education, certifications and courses
- **Labs** — Certificates, TryHackMe badges and completed rooms
- **Projects** — Portfolio of projects
- **Contact** — Contact form via Formspree
- **KI i barnehagen** (`/ki-veileder/`) — Online version of the AI guide, one page per chapter, linked from Projects
- **Games** (`games.html`) — Snake; available online but not linked in the menu

## Tech Stack
- HTML / CSS / JavaScript
- Jekyll (layouts and data files for the AI guide and certifications)
- Canvas API (animated background)
- Python (TryHackMe data sync)
- Formspree (contact form)
- GitHub Pages (hosting)
- Cloudflare (DNS, TLS and security headers)
- Custom domain: trinelandsem.no

## Security
The site is served through Cloudflare with:
- **Full (Strict) TLS** between visitors, Cloudflare and GitHub Pages
- **Always Use HTTPS** and **HSTS**
- **Security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- **Content Security Policy** — only approved sources may load scripts, styles, fonts, frames and form targets
- **DNSSEC** — signed DNS records, with the DS record published in the .no zone
- **No third-party fonts** — system fonts only, so no visitor data is sent to Google Fonts
- **security.txt** (`/.well-known/security.txt`) and a [security policy](.github/SECURITY.md) for reporting vulnerabilities
- **GitHub security features** — secret scanning, Dependabot alerts, CodeQL code scanning and private vulnerability reporting
- **Verified custom domain** in GitHub Pages to prevent domain takeover
- **Spam trap** (honeypot field) on the contact form

Headers are set with Cloudflare Response Header Transform Rules, since GitHub Pages does not support custom headers.
Data from TryHackMe is rendered with `textContent` (never `innerHTML`), and badge images are hosted locally.

## TryHackMe sync
The Labs page reads `static/data/thm.json`, rendered by `static/js/thm.js`.

To update after completing new rooms, run from the project folder on Windows:

```
scripts\oppdater_thm.bat
```

The script pulls the latest changes, fetches public profile data with `scripts/update_thm.py`, and commits/pushes
`static/data/thm.json` and any new badge images in `static/images/thm/`.
TryHackMe blocks automated downloads of badge images, so a new badge needs one manual step: the script prints the
file name it expects, you save the badge image as `static/images/thm/<badge-name>.png`, and run the script again.
Streak, raffle and league badges are skipped and need no image.

> TryHackMe rate-limits GitHub Actions runners (HTTP 429), so the sync runs locally.
> The workflow in `.github/workflows/update-thm.yml` can still be triggered manually.

## Certifications
Certifications are stored in `_data/certifications.yml` and rendered on About me and Labs by `_includes/certifications.html`.
To add a new one, put a new entry at the top of the list (fields are explained at the top of the file), commit and push.

## AI guide (KI i barnehagen)
The online guide lives in `ki-veileder/` as one Markdown file per page, using the layout `_layouts/veileder.html`.
Chapter list, version number and references are in `_data/veileder.yml`. The full guide is also available as a PDF in `static/docs/`.
When the guide is updated, replace the PDF (same file name) and update the matching Markdown pages.

## Structure
```
trinelandsem.no/
├── .github/
│   ├── SECURITY.md        # how to report vulnerabilities
│   └── workflows/
│       └── update-thm.yml # manual trigger only
├── .well-known/
│   └── security.txt
├── .gitignore
├── CNAME                  # custom domain for GitHub Pages
├── _config.yml            # Jekyll settings: excludes README and scripts, includes .well-known
├── _data/
│   ├── certifications.yml # certifications shown on About me and Labs
│   └── veileder.yml       # chapters, version and references for the AI guide
├── _includes/
│   └── certifications.html
├── _layouts/
│   └── veileder.html      # layout for the AI guide
├── index.html
├── about.html
├── cv.html                # redirects to about.html (old links)
├── labs.html
├── news.html
├── projects.html
├── games.html             # not linked in the menu
├── contact.html
├── ki-veileder/           # online AI guide, one Markdown file per page
├── scripts/
│   ├── oppdater_thm.bat   # run after completing new rooms
│   └── update_thm.py
├── static/
│   ├── css/
│   │   ├── certifications.css
│   │   └── veileder.css
│   ├── data/
│   │   └── thm.json
│   ├── docs/
│   │   └── ki-i-barnehagen-veileder-2026.pdf
│   ├── js/
│   │   ├── bg.js
│   │   ├── snake.js
│   │   ├── thm.js
│   │   └── veileder.js
│   └── images/
│       ├── thm/           # TryHackMe badge images
│       ├── cert-presecurity.png
│       ├── favicon.png
│       ├── logo_512.png
│       ├── profilbilde.png
│       └── veileder-ki-cover.png
└── README.md
```
## Tools
Developed with assistance from AI tools for code generation and debugging.

## Deployment
Hosted on GitHub Pages with a custom domain configured through Cloudflare DNS — including A-records and CNAME setup with HTTPS enforcement.

## Images
All photographs on this site are protected by copyright and remain the property of Trine Landsem.
Any use requires prior written permission.

---

© 2026 Trine Landsem · All rights reserved
