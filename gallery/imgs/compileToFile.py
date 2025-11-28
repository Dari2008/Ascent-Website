import os
from PIL import Image

dir = "./photos"
dirVids = "./videos"
outputImage = "../galleryImages.json"
outputVideo = "../galleryVideos.json"
relativeDir = "./imgs"

jsonImages = []
jsonVideos = []

def print_image_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                addImage(file, root)

def print_video_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.mp4'):
                addVideo(file, root)

def addImage(file, root):
    # Assuming the image file is in the format "name.jpg"
    name = os.path.splitext(file)[0]
    path = os.path.join(root, file)
    width = 0
    height = 0

    img = Image.open(path)
    width, height = img.size
    img.close()
    jsonImages.append({
        "title": name,
        "src": relativeDir + path.replace("\\", "/").replace("./", "/"),
        "srct": relativeDir + path.replace("\\", "/").replace("./", "/"),
        "width": width,
        "height": height
    })

def addVideo(file, root):
    # Assuming the video file is in the format "name.mp4"
    name = os.path.splitext(file)[0]
    path = os.path.join(root, file)
    jsonVideos.append({
        "title": name,
        "src": relativeDir + path.replace("\\", "/").replace("./", "/"),
        "srct": relativeDir + path.replace("\\", "/").replace("./", "/"),
    })

print_image_files(dir)
print_video_files(dirVids)

# Write the JSON to a file
with open(outputImage, 'w') as f:
    f.write(str(jsonImages).replace("'", '"'))
    print(f"JSON file created at {outputImage}")

with open(outputVideo, 'w') as f:
    f.write(str(jsonVideos).replace("'", '"'))
    print(f"JSON file created at {outputVideo}")