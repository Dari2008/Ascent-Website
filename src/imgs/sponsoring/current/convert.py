from PIL import Image

# Load the image
image_path = "Kayhof.png"
image = Image.open(image_path).convert("RGBA")

# Create a new image for the inverted result
inverted_image = Image.new("RGBA", image.size)

# Process each pixel
width, height = image.size
for x in range(width):
    for y in range(height):
        r, g, b, a = image.getpixel((x, y))
        # Calculate brightness inversion
        inverted_pixel = (255 - r, 255 - g, 255 - b, a)
        inverted_image.putpixel((x, y), inverted_pixel)

# Save the inverted image
inverted_image.save("Kayhof_inverted.png")
print("Inverted image saved as Kayhof_inverted.png")