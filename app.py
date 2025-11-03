import os, json
from flask import Flask, render_template, request, jsonify, session
from dotenv import load_dotenv
from groq import Groq
import logging
from datetime import datetime

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
DEFAULT_SYSTEM_PROMPT = (
    "You are a helpful, polite customer support assistant. "
    "Always reply in English in a friendly tone. "
    "Remember the conversation context and greet users politely."
)

app = Flask(__name__)
app.secret_key = os.urandom(24)

os.makedirs("memory", exist_ok=True)
os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    filename="logs/conversations.log",
    level=logging.INFO,
    format="%(asctime)s %(message)s"
)

def save_memory(user_id, conversation):
    filename = f"memory/chat_{user_id}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(conversation, f, ensure_ascii=False, indent=2)

def load_memory(user_id):
    filename = f"memory/chat_{user_id}.json"
    if not os.path.exists(filename):
        return []
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)

def ask_groq_conversation(conversation, model="openai/gpt-oss-20b"):
    messages_for_groq = [{"role": "system", "content": DEFAULT_SYSTEM_PROMPT}]
    for msg in conversation:
        messages_for_groq.append({"role": msg["role"], "content": msg["content"]})

    response = client.chat.completions.create(
        messages=messages_for_groq,
        model=model,
        max_tokens=256,
        temperature=0.2,
    )
    
    try:
        return response.choices[0].message.content
    except Exception:
        return "Sorry — I could not get a response right now."

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Message is required"}), 400

    if "user_id" not in session:
        session["user_id"] = datetime.now().strftime("%Y%m%d%H%M%S")
    user_id = session["user_id"]
    conversation = load_memory(user_id)
    
    conversation.append({
        "role": "user", 
        "content": message, 
        "timestamp": datetime.now().strftime("%d-%b-%Y %I:%M %p")
    })

    assistant_reply = ask_groq_conversation(conversation)

    conversation.append({
        "role": "assistant", 
        "content": assistant_reply, 
        "timestamp": datetime.now().strftime("%d-%b-%Y %I:%M %p")
    })

    save_memory(user_id, conversation)

    logging.info(f"USER({user_id}): {message}")
    logging.info(f"BOT: {assistant_reply}")

    return jsonify({
    "reply": assistant_reply,
    "timestamp": str(datetime.now())
    })
    

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
