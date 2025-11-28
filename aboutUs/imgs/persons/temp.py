from PIL import Image
import os

# Ordner mit den Bildern
input_folder = './'
output_folder = './'

# Finde die maximalen Abmessungen
max_width = 0
max_height = 0

# Gehe alle Bilder im Ordner durch, um maximale Abmessungen zu finden
for filename in os.listdir(input_folder):
    if filename.endswith('.png'):
        img = Image.open(os.path.join(input_folder, filename))
        width, height = img.size
        max_width = max(max_width, width)
        max_height = max(max_height, height)

# Erstelle für jedes Bild ein neues Bild mit den maximalen Abmessungen
for filename in os.listdir(input_folder):
    if filename.endswith('.png'):
        img = Image.open(os.path.join(input_folder, filename))
        original_width, original_height = img.size

        # Berechne den Skalierungsfaktor, um innerhalb der Max-Größe zu bleiben
        scale = min(max_width / original_width, max_height / original_height)
        new_width = int(original_width * scale)
        new_height = int(original_height * scale)

        # Bild proportional verkleinern
        resized_img = img.resize((new_width, new_height), resample=Image.Resampling.LANCZOS)

        # Neues leeres Bild mit max Größe erstellen
        new_image = Image.new('RGBA', (max_width, max_height), (255, 255, 255, 0))

        # Berechne Position: horizontal zentriert, unten ausgerichtet
        left = (max_width - new_width) // 2
        top = max_height - new_height

        # Bild einfügen
        new_image.paste(resized_img, (left, top), resized_img)

        # Speichern
        new_image.save(os.path.join(output_folder, f"resized_{filename}"))
