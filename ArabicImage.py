from pytesseract import image_to_string 
from PIL import Image
import cv2
import pytesseract
import socket
import os
import sys

pytesseract.pytesseract.tesseract_cmd = r"full path to the exe file"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
build = ""

x = sys.argv[1]
# really not sure what it is but the --psm fixed stuff
out = str(((pytesseract.image_to_string(x, config='--psm 8', lang='ara'))))
# img_cv = cv2.imread(x)
# img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
# out = pytesseract.image_to_string(img_rgb, lang='ara')
out = out.split("\n")[0]
for i in out:
    if(ord(i) > 1000):
        build = build + str(ord(i)) + ' '

os.system('echo ' + build)