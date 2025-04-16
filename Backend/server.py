from fastapi import FastAPI, File, UploadFile
from PIL import Image
import pytesseract
import os  # Required for directory and file operations
from fastapi.middleware.cors import CORSMiddleware
from fuzzywuzzy import fuzz

app = FastAPI()

# Configure Tesseract OCR executable path (update this path based on your system)
pytesseract.pytesseract.tesseract_cmd = r'C:\Users\Rohun\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

# Enable CORS to allow requests from the React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define the directory to save test_receipts
UPLOAD_DIRECTORY = "temporary"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)  # Create the directory if it doesn't exist

def extract_text(txt, threshold=65):
    # Step 1: Split the text by newline
    lines = txt.splitlines()

    # Step 2: Create a dictionary where each line is a key, initialized to 1
    item_dict = {}
    for line in lines:
        line = line.strip()  # Remove any extra spaces around the line
        if line:  # Only consider non-empty lines
            matched = False
            for key in item_dict:
                # Compare the current line with each key in the dictionary using fuzzy matching
                if fuzz.ratio(line, key) > threshold:
                    item_dict[key] += 1  # If the match is above threshold, increment count
                    matched = True
                    break
            if not matched:
                item_dict[line] = 1  # Otherwise, add it to the dictionary with count 1

    return item_dict

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    # Read the uploaded image
    contents = await file.read()

    # Generate a unique filename to avoid overwriting (optional but recommended)
    file_path = os.path.join(UPLOAD_DIRECTORY, "receipt.jpg")

    # Save the file to the uploads directory
    with open(file_path, "wb") as f:
        f.write(contents)

    # Open the saved image for OCR
    image = Image.open(file_path)

    # Correct the orientation based on EXIF data
    rotated_image = image.rotate(-90, expand=True)

    rotated_image.save("temporary/rotated_receipt.jpg")

    # Extract text using Tesseract OCR
    text = pytesseract.image_to_string(rotated_image)

    # os.remove("temporary/receipt.jpg")
    os.remove("temporary/rotated_receipt.jpg")

    items = extract_text(text)

    return items

# RUNNING THE SERVER:
# uvicorn server:app --host 0.0.0.0 --port 8000