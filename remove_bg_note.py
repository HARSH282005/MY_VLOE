from PIL import Image

def remove_white(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    threshold = 240
    for item in datas:
        if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
            new_data.append((255, 255, 255, 0)) # transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_white("c:/ANTIGRAVITY/PLUTO/public/note.jpg", "c:/ANTIGRAVITY/PLUTO/public/note.png")
print("Done")
