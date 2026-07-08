from PIL import Image

try:
    # Open the original copy from downloads
    orig_path = "/Users/apple/Downloads/AstroLearn New Logo .png"
    img = Image.open(orig_path)
    
    # We know the bounding box of the entire logo+text is (108, 464, 961, 616)
    # The height is 616 - 464 = 152 pixels.
    # The yellow square icon on the left should be roughly a square of 152x152.
    # Let's crop from x=108 to x=108+152 = 260, and y=464 to y=616.
    box_crop = img.crop((108, 464, 260, 616))
    
    # Save as public/logo-icon.png
    box_crop.save("/Users/apple/Downloads/astro-app/public/logo-icon.png")
    print("SUCCESS: Cropped the square Saturn logo icon and saved to public/logo-icon.png")
except Exception as e:
    print(f"ERROR: {e}")
