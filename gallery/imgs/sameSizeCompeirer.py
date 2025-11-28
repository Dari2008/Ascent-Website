import os
import shutil

dir = "."
outDir = "./sizes/"
ext = ".jpg"

plusMinus = 100

images: dict = {}
others: list = []

def addImage(image1):

    if not os.path.exists(image1):
        return
    
    if not image1.lower().endswith(ext):
        return
    
    size = os.path.getsize(image1)
    if size in images:
        images[size].append(image1)
    else:
        was = False
        for i in range(-plusMinus, plusMinus + 1):
            adjustedSize = size + i
            if adjustedSize in images:
                images[adjustedSize].append(image1)
                was = True
                break

        if not was:
            images[size] = [image1]



def findSameSizeImages():
    for root, dirs, files in os.walk(dir):
        if(root.count("original") > 0):
            continue
        for file in files:
            if file.lower().endswith(ext):
                filePath = os.path.join(root, file)
                addImage(filePath)
    return images

def putInFolders():
    for size, imageList in images.items():
        if len(imageList) < 2:
            continue

        print(imageList)

        folderName = f"{size/1024}"
        folderPath = os.path.join(outDir, folderName)

        if not os.path.exists(folderPath):
            os.makedirs(folderPath)

        for image in imageList:
            shutil.move(image, folderPath)
            print(f"Moved {image} to {folderPath}")


def main():
    findSameSizeImages()
    putInFolders()

if __name__ == "__main__":
    if not os.path.exists(outDir):
        os.makedirs(outDir)
    main()