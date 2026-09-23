@echo off
REM Henter TryHackMe-data fra din egen PC (GitHub blir blokkert av TryHackMe)
REM og pusher static/data/thm.json til GitHub hvis noe er nytt.
cd /d "%~dp0.."
git pull --rebase --autostash
".venv\Scripts\python.exe" scripts\update_thm.py
git add static/data/thm.json static/images/thm
git diff --cached --quiet -- static/data/thm.json static/images/thm || (git commit -m "Oppdater TryHackMe-data" -- static/data/thm.json static/images/thm && git push)
