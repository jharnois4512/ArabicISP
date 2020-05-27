from pytesseract import image_to_string 
from PIL import Image
import cv2
import pytesseract
import socket
import sys

x = sys.argv[1]
img_cv = cv2.imread(x)
img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
out = pytesseract.image_to_string(img_rgb, lang='ara')[::-1]
print(out)