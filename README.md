# trinelandsem.no

Personal portfolio website for Trine Landsem — cybersecurity student — built with pure HTML, CSS and JavaScript.

## About
A cyberpunk-themed personal portfolio featuring an animated network background, falling glyphs and moving data packets.
The CV page includes a TryHackMe progress section generated from synced profile data.

## Pages
- **Home** — Landing page
- **News** — Latest updates and announcements
- **About me** — Information and background
- **CV** — Work experience, education, certifications and TryHackMe progress
- **Projects** — Portfolio of projects
- **Contact** — Contact form via Formspree

## Tech Stack
- HTML / CSS / JavaScript
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

Headers are set with Cloudflare Response Header Transform Rules, since GitHub Pages does not support custom headers.
Data from TryHackMe is rendered with `textContent` (never `innerHTML`), and badge images are hosted locally.

## TryHackMe sync
The CV page reads `static/data/thm.json`, rendered by `static/js/thm.js`.

To update after completing new rooms, run from the project folder on Windows:

```
scripts\oppdater_thm.bat
```

The script pulls the latest changes, fetches public profile data with `scripts/update_thm.py`, and commits/pushes
`static/data/thm.json` and any new badge images in `static/images/thm/`.
If a badge image cannot be downloaded, save it manually as `static/images/thm/<badge-name>.png` and run the script again.

> TryHackMe rate-limits GitHub Actions runners (HTTP 429), so the sync runs locally.
> The workflow in `.github/workflows/update-thm.yml` can still be triggered manually.

## Structure
```
trinelandsem.no/
├── index.html
├── about.html
├── cv.html
├── news.html
├── projects.html
├── contact.html
├── nav.html / nav.js
├── _config.yml            # excludes README and scripts from the published site
├── scripts/
│   ├── oppdater_thm.bat   # run after completing new rooms
│   └── update_thm.py
├── static/
│   ├── data/
│   │   └── thm.json
│   ├── js/
│   │   ├── bg.js
│   │   └── thm.js
│   └── images/
│       ├── thm/           # TryHackMe badge images
│       ├── favicon.png
│       ├── logo_512.png
│       ├── profilbilde.png
│       └── cv_profilbilde.png
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
