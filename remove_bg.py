from PIL import Image

def remove_white(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    # threshold for "white"
    threshold = 240
    for item in datas:
        # if r, g, b are all greater than threshold, it's white-ish
        if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
            new_data.append((255, 255, 255, 0)) # transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_white("c:/ANTIGRAVITY/PLUTO/public/sticker1.jpg", "c:/ANTIGRAVITY/PLUTO/public/sticker1.png")
remove_white("c:/ANTIGRAVITY/PLUTO/public/sticker2.jpg", "c:/ANTIGRAVITY/PLUTO/public/sticker2.png")
remove_white("c:/ANTIGRAVITY/PLUTO/public/sticker3.jpg", "c:/ANTIGRAVITY/PLUTO/public/sticker3.png")
print("Done")
