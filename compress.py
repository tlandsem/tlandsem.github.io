from PIL import Image
import os
import shutil

gallery_path = r'static\images\gallery'
backup_path = r'static\images\gallery_backup'

# Lag backup
shutil.copytree(gallery_path, backup_path)
print("Backup laget!")

# Komprimer alle bilder
count = 0
for root, dirs, files in os.walk(gallery_path):
    for file in files:
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(root, file)
            img = Image.open(filepath)
            # Resize hvis større enn 1920px
            if img.width > 1920 or img.height > 1920:
                img.thumbnail((1920, 1920), Image.LANCZOS)
            img.save(filepath, optimize=True, quality=75)
            count += 1
            print(f"Komprimert: {file}")

print(f"\nFerdig! {count} bilder komprimert.")