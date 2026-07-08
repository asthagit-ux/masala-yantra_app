from PIL import Image

try:
    img_path = "/Users/apple/Downloads/astro-app/public/logo.png"
    img = Image.open(img_path)
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Crop the image to the bounding box
        cropped = img.crop(bbox)
        cropped.save(img_path)
        print(f"SUCCESS: Cropped logo from original bbox {bbox} and saved.")
    else:
        print("ERROR: Bounding box not found, image might be fully transparent.")
except Exception as e:
    print(f"ERROR: {e}")
