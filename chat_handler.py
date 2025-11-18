import os
from groq import Groq

api_key = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=api_key)

system_prompt = "You are a helpful, polite customer support assistant. Remember the conversation context and respond clearly and politely."

def ask_groq_conversation(chat_history, model_name="openai/gpt-oss-20b"):
    msgs = [{"role": "system", "content": system_prompt}] + chat_history

    try:
        res = client.chat.completions.create(
            messages=msgs,
            model=model_name,
            max_tokens=256,
            temperature=0.2
        )
        reply = res.choices[0].message.content
    except Exception as err:
        reply = "Sorry, unable to respond right now."
        res = {"error": str(err)}

    return {
        "assistant": reply,
        "raw_response": res
    }
