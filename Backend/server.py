from fastapi import FastAPI, File, UploadFile
from PIL import Image
import pytesseract
import os  # Required for directory and file operations
from fastapi.middleware.cors import CORSMiddleware

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

    os.remove("temporary/receipt.jpg")
    os.remove("temporary/rotated_receipt.jpg")

    return {"text": text}

# RUNNING THE SERVER:
# uvicorn main:app --host 0.0.0.0 --port 8000