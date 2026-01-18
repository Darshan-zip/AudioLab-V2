from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, GPT2Tokenizer,GPT2LMHeadModel

from better_profanity import profanity
import os
import re
import formater  # your Gemini/formatting helper

# ------------------------ Helper Functions ------------------------ #

def convert_markdown_bold(text):
    """Convert Markdown-style **bold** to HTML <strong>."""
    return re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)

def convert_to_structured_prompt(user_input):
    """Extract genre and artist, then form structured model prompt."""
    match = re.search(r"lyrics like (.*?) in (.*?) genre", user_input, re.IGNORECASE)
    if match:
        artist = match.group(1).strip()
        genre = match.group(2).strip()
        return f"<|genre|>{genre}<|artist|>{artist}<|lyrics|>"
    return None

# ------------------------ Flask Setup ------------------------ #

app = Flask(__name__)
CORS(app)

# ------------------------ Chat Endpoint ------------------------ #

@app.route('/api/chat', methods=['POST'])
def chat():
    print("🔥 /api/chat endpoint hit!")

    try:
        data = request.get_json()
        user_prompt = data.get("message", "")
        print("User prompt:", user_prompt)

        structured_prompt = convert_to_structured_prompt(user_prompt)
        if not structured_prompt:
            return jsonify({"reply": "❌ Invalid input format. Please say: 'Lyrics like <artist> in <genre> genre'."}), 400

        # Resolve model path safely
        model_path = os.path.abspath("./lyrics_generator")

        if not os.path.exists(model_path):
            return jsonify({"reply": "❌ Model folder './lyrics_generator' not found. Please ensure the model is saved correctly."}), 500

        


        # Load the model and tokenizer directly with local_files_only
        tokenizer = GPT2Tokenizer.from_pretrained(model_path, local_files_only=True)
        model = GPT2LMHeadModel.from_pretrained(model_path, local_files_only=True)

        # Now create the pipeline
        generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

        print("✅ Model loaded from:", model_path)

        # Generate lyrics
        generated = generator(
            structured_prompt,
            max_length=500,
            num_return_sequences=1,
            do_sample=True,
            top_k=50,
            top_p=0.92,
            temperature=0.8,
            repetition_penalty=1.2
        )

        output = generated[0]["generated_text"]
        print("🎵 Raw model output generated")

        # Clean output
        profanity.load_censor_words()
        clean_output = profanity.censor(output)
        clean_lyrics = re.sub(r"<\|genre\|>.*?<\|artist\|>.*?<\|lyrics\|>", "", clean_output)

        # Optional Gemini formatting
        try:
            formatted = formater.check_sustainability(clean_lyrics).candidates[0].content.parts[0].text
            print("🔥 Formatter output received")
        except Exception as e:
            print("⚠️ Formatter failed:", e)
            formatted = clean_lyrics  # fallback to raw cleaned lyrics

        # Extract structured sections (if any)
        section_matches = re.findall(r'\*\*Section (\d+):\s*(.*?)\*\*\n((?:\* .+?\n)+)', formatted)
        result = ""
        lyrics_by_section = {}

        for section_number, section_title, lyrics_block in section_matches:
            lyrics_lines = re.findall(r'\* (.+)', lyrics_block)
            lyrics_by_section[int(section_number)] = lyrics_lines

        for section, lines in lyrics_by_section.items():
            result += f"<strong>Section {section}:</strong><br>"
            for line in lines:
                result += f" - {line}<br>"

        # If no structured formatting detected, just return formatted text
        if not result:
            result = convert_markdown_bold(formatted).replace('\n', '<br>')

        print("✅ Response prepared successfully")
        return jsonify({"reply": result})

    except Exception as e:
        print("❌ Internal Server Error:", e)
        return jsonify({"reply": f"Internal server error: {str(e)}"}), 500


# ------------------------ Run App ------------------------ #

if __name__ == '__main__':
    print("🚀 Starting Flask backend on port 5000")
    app.run(debug=True, port=5000)
