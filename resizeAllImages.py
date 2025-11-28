from PIL import Image
import os
import threading

# Parameters
rootFolder = './dist'  # Root folder containing images and subfolders
max_width = 1920
max_height = 1080
overwrite = True  # Set to False to save resized images to a new location


def resize_image(input_path, max_width, max_height):
            # Open image
            img = Image.open(input_path)
            original_width, original_height = img.size

            # Calculate scaling factor
            scale = min(max_width / original_width, max_height / original_height)
            new_width = int(original_width * scale)
            new_height = int(original_height * scale)

            # Resize with high-quality resampling
            resized_img = img.resize((new_width, new_height), resample=Image.Resampling.LANCZOS)
            resized_img.save(input_path)

# Walk through all files in the root folder and subfolders
for dirpath, dirnames, filenames in os.walk(rootFolder):
    for filename in filenames:
        if filename.lower().endswith('.png') or filename.lower().endswith('.webp'):
            input_path = os.path.join(dirpath, filename)
            threading.Thread(target=resize_image, args=(input_path, max_width, max_height)).start()
            print(f"Processing image: {input_path}")



print("Resizing complete.")
