"""Henter offentlige TryHackMe-data for profilen og lagrer dem i static/data/thm.json.
Kjøres automatisk av GitHub Actions (.github/workflows/update-thm.yml).
Hvis TryHackMe ikke svarer, beholdes den gamle filen uendret."""
import json, sys, time, urllib.error, urllib.request
from datetime import datetime, timezone

USERNAME = "novaninja"
BASE = "https://tryhackme.com/api/v2"
OUT = "static/data/thm.json"
IMG_DIR = "static/images/thm"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": f"https://tryhackme.com/p/{USERNAME}",
}

def get(path, attempts=5):
    """Henter JSON. Ved 429 (for mange forespørsler) eller 5xx venter den og prøver igjen."""
    wait = 20
    for i in range(1, attempts + 1):
        try:
            req = urllib.request.Request(BASE + path, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as r:
                data = json.load(r)
            if data.get("status") != "success":
                raise RuntimeError(f"Uventet svar fra {path}")
            time.sleep(3)  # vær snill mot API-et mellom forespørslene
            return data["data"]
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503, 504) or i == attempts:
                raise
            delay = int(e.headers.get("Retry-After") or wait)
            print(f"HTTP {e.code} på forsøk {i}, venter {delay} sek ...")
            time.sleep(min(delay, 180))
            wait *= 2

try:
    p = get(f"/public-profile?username={USERNAME}")
    rooms, page = [], 1
    while True:
        cr = get(f"/public-profile/completed-rooms?username={USERNAME}&limit=50&page={page}")
        rooms += cr["docs"]
        if not cr.get("hasNextPage"):
            break
        page += 1
    badges = get(f"/users/badges?username={USERNAME}")
except Exception as e:
    # ::warning:: vises som et gult varsel under «Annotations» i GitHub Actions
    print(f"::warning::Kunne ikke hente data fra TryHackMe, beholder gammel fil: {e}")
    sys.exit(0)

def local_badge(b):
    """Laster ned merkebildet til nettsiden din, så besøkende ikke henter noe fra TryHackMe."""
    import os, re
    name = re.sub(r"[^a-z0-9-]", "", b["name"].lower()) or "badge"
    path = f"{IMG_DIR}/{name}.png"
    if not os.path.exists(path):
        os.makedirs(IMG_DIR, exist_ok=True)
        req = urllib.request.Request(b["image"], headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as r, open(path, "wb") as f:
            f.write(r.read())
    return path

try:
    badge_images = {b["name"]: local_badge(b) for b in badges}
except Exception as e:
    print(f"::warning::Kunne ikke laste ned merkebilder, beholder gammel fil: {e}")
    sys.exit(0)

snapshot = {
    "username": p["username"], "level": p.get("level"), "rank": p.get("rank"),
    "completedRoomsNumber": p.get("completedRoomsNumber"), "badgesNumber": p.get("badgesNumber"),
    "badges": [{"name": b["name"], "image": badge_images[b["name"]], "earnedAt": b["earnedAt"]} for b in badges],
    "rooms": [{"title": r["title"].strip(), "code": r["code"], "difficulty": r.get("difficulty"),
               "tags": r.get("technologyTags") or []} for r in rooms],
}

try:
    with open(OUT, encoding="utf-8") as f:
        old = json.load(f)
    old.pop("updated", None)
    if old == snapshot:
        print("Ingen endringer.")
        sys.exit(0)
except FileNotFoundError:
    pass

snapshot["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(snapshot, f, ensure_ascii=False, indent=2)
print(f"Oppdatert: {len(snapshot['rooms'])} rom, {len(snapshot['badges'])} merker.")
