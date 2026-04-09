# Trine Landsem — Personal Website

Personal portfolio website built from scratch with Python and Flask.
Features a dark cyberpunk aesthetic with an animated network background,
and includes pages for biography, CV, photography gallery, and Forever Living products.
Deployed via GitHub Pages with a custom domain configured through DNS management,
including CNAME record setup and SSL/TLS certificate provisioning for HTTPS enforcement.

**Live site:** [trinelandsem.no](https://trinelandsem.no)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3, Flask |
| Templating | Jinja2 |
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Animation | Canvas API |
| Fonts | Rajdhani — Google Fonts |
| Hosting | GitHub Pages |
| DNS | Custom domain with CNAME record |
| Security | HTTPS enforced via TLS certificate |

---

## Project Structure

```
Nettside/
├── app.py
├── .venv/
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── about.html
│   ├── cv.html
│   ├── photos.html
│   ├── forever_living.html
│   ├── projects.html
│   └── contact.html
└── static/
    └── images/
        ├── cv_profilbilde.png
        ├── favicon.png
        ├── profilbilde.png
        └── gallery/
```

---

## Pages

- **Home** — Animated landing page
- **About me** — Brief Background Information
- **CV** — Work experience, education, and skills
- **Photos** — Photography gallery with lightbox
- **Forever Living** — Product page with store links
- **Projects** — Portfolio of technical projects
- **Contact** — Contact information

---

## Running Locally

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Mac/Linux

# Install dependencies
pip install flask

# Start development server
python app.py
```

Site available at `http://127.0.0.1:5000`

---

## Photography

All photographs on this site are protected by copyright and remain the property of Trine Landsem.
Any use requires prior written permission.

---
 
© 2026 Trine Landsem · All rights reserved