from PIL import Image
import pytesseract
import re
from transformers import AutoModelForCausalLM, AutoTokenizer

pytesseract.pytesseract.tesseract_cmd = r'C:\Users\Rohun\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

def get_text_from_image(file_path):
    image = Image.open(file_path)

    # Use pytesseract to do OCR on the image
    text = pytesseract.image_to_string(image)

    # Print the extracted text
    return text


def parse_receipt(receipt_text: str) -> (dict, float):
    items = {}
    total_cost = 0.0
    lines = receipt_text.splitlines()

    # Pattern to match items and their prices
    item_price_pattern = re.compile(r'^(.*?\b)\s*\$([0-9]+\.[0-9]{2})$')
    total_pattern = re.compile(r'TOTAL.*\$([0-9]+\.[0-9]{2})')

    # Keywords to exclude non-food items
    exclude_keywords = {'SUBTOTAL', 'LOYALTY', 'TOTAL', 'CASH', 'CHANGE', 'SPECIAL'}

    for line in lines:
        line = line.strip()
        item_match = item_price_pattern.match(line)
        if item_match:
            item_name = item_match.group(1).strip().upper()
            item_price = float(item_match.group(2))
            if item_name not in exclude_keywords:
                if item_name in items:
                    items[item_name] += item_price
                else:
                    items[item_name] = item_price
        total_match = total_pattern.search(line)
        if total_match:
            total_cost = float(total_match.group(1))

    return items, total_cost

def get_parsed_results_falcon(question):

    model_name = "tiiuae/falcon-7b-instruct"
    cache_dir = "./cache"

    tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir=cache_dir)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        device_map="auto",
        torch_dtype="auto",
        cache_dir=cache_dir
    )

    inputs = tokenizer(question, return_tensors="pt").to("cuda")
    outputs = model.generate(inputs["input_ids"], max_length=400)

    return tokenizer.decode(outputs[0], skip_special_tokens=True)


def main():
    file_path = "test_receipt_2.png"
    receipt_results = get_text_from_image(file_path)
    question = """Extract all food items and their costs from the following receipt and list them.
        Here is the receipt: """ + receipt_results
    #parsed_output = get_parsed_results_falcon(question)
    print(receipt_results)


if __name__ == '__main__':
    main()