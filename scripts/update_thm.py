"""Henter offentlige TryHackMe-data for profilen og lagrer dem i static/data/thm.json.
Kjøres automatisk av GitHub Actions (.github/workflows/update-thm.yml).
Hvis TryHackMe ikke svarer, beholdes den gamle filen uendret."""
import json, sys, urllib.request
from datetime import datetime, timezone

USERNAME = "novaninja"
BASE = "https://tryhackme.com/api/v2"
OUT = "static/data/thm.json"

def get(path):
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "Mozilla/5.0 (trinelandsem.no profile sync)", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    if data.get("status") != "success":
        raise RuntimeError(f"Uventet svar fra {path}")
    return data["data"]

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
    print(f"Kunne ikke hente data fra TryHackMe, beholder gammel fil: {e}")
    sys.exit(0)

snapshot = {
    "username": p["username"], "level": p.get("level"), "rank": p.get("rank"),
    "completedRoomsNumber": p.get("completedRoomsNumber"), "badgesNumber": p.get("badgesNumber"),
    "badges": [{"name": b["name"], "image": b["image"], "earnedAt": b["earnedAt"]} for b in badges],
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
