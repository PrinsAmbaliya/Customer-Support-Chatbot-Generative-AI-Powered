# Customer Support Chatbot – Generative AI Powered

## Overview
This project is a **Generative AI–powered Customer Support Chatbot** designed to assist users with queries in real time.  
It uses **Python (Flask)** for backend integration and the **Groq API** for generating intelligent, context-aware responses.  
The chatbot features a clean web interface with support for both **light and dark modes** and remembers previous conversation context for a more human-like chat experience.

---

## Features
- Conversational AI using **Groq LLM API**
- Flask-based backend with RESTful API integration
- Frontend built with **HTML, CSS, and JavaScript**
- Dynamic theme support (Light/Dark mode)
- Chat memory for maintaining conversation context
- Responsive, WhatsApp-like chat UI

---

## Tech Stack
| Component | Technology Used |
|------------|------------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Flask (Python) |
| AI Model | Groq API (Generative AI) |
| Version Control | Git & GitHub |

---

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrinsAmbaliya/Customer-Support-Chatbot-Generative-AI-Powered.git
   cd Customer-Support-Chatbot-Generative-AI-Powered

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # For Windows

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt

4. **Run the Flask server**
   ```bash
   python app.py

5. **Access the chatbot**
   Open your browser and visit:
   http://127.0.0.1:5000/

---

## How It Works

1. The user types a message into the chat interface.
2. The frontend sends this message to the Flask backend.
3. Flask processes the request and sends it to the Groq Generative AI API.
4. The API generates a response, which is returned to the frontend and displayed as the chatbot’s reply.
5. Chat history is maintained in memory for contextual understanding.

---

## Screenshots
Dark Mode :
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/572c956c-08ee-4885-9549-8eeea45d46d1" />

Light Mode :
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/df4d92eb-1c27-474f-8d56-d46841dd615d" />

---

## Author

Prins Ambaliya

GitHub: PrinsAmbaliya

LinkedIn: https://www.linkedin.com/in/prins-ambaliya-bb7546367
