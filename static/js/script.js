const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const voiceBtn = document.getElementById("voiceBtn");
const ttsToggle = document.getElementById("ttsToggle");

const userLogo = "/static/images/user-logo.png";
const botLogo = "/static/images/bot-logo.png";

let ttsEnabled = true;

const micImg = document.createElement("img");
micImg.src = "/static/images/mic.png";
micImg.style.width = "22px";
micImg.style.height = "22px";
voiceBtn.innerHTML = "";
voiceBtn.appendChild(micImg);

const speakerImg = ttsToggle.querySelector("img");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;
let listening = false;
let micStream = null;

if (SpeechRecognition) {
    recognizer = new SpeechRecognition();
    recognizer.lang = "en-US";
    recognizer.continuous = true;
    recognizer.interimResults = true;

    recognizer.onstart = () => {
        micImg.src = "/static/images/mic.png";
        voiceBtn.classList.add("listening");
    };

    recognizer.onresult = (event) => {
        let text = "";
        let hasVoice = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result[0].transcript.trim().length > 0) {
                text += result[0].transcript;
                hasVoice = true;
            }
        }

        if (hasVoice) {
            userInput.value = text;
            if (event.results[event.results.length - 1].isFinal) {
                setTimeout(() => chatForm.requestSubmit(), 300);
            }
        }
    };

    recognizer.onerror = () => {
        stopListening();
    };
}

voiceBtn.addEventListener("click", () => {
    if (!SpeechRecognition) return;
    if (!listening) startListening();
    else stopListening();
});

function startListening() {
    if (!recognizer) return;
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            micStream = stream;
            recognizer.start();
            listening = true;
        });
}

function stopListening() {
    if (recognizer && listening) {
        try { recognizer.stop(); } catch (e) {}
    }
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
    }
    listening = false;
    voiceBtn.classList.remove("listening");
    micImg.src = "/static/images/mic.png";
}

function speakText(text) {
    if (!ttsEnabled || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
}

ttsToggle.addEventListener("click", () => {
    ttsEnabled = !ttsEnabled;

    if (ttsEnabled) {
        ttsToggle.classList.add("active");
    } else {
        ttsToggle.classList.remove("active");
    }
});

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = userInput.value.trim();
    if (!msg) return;

    addMessage(msg, "user", userLogo, new Date());
    userInput.value = "";

    const typingMsg = addTypingIndicator(botLogo);

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg }),
        });

        const data = await res.json();
        setTimeout(() => {
            typingMsg.remove();
            addMessage(data.reply || "Sorry, try again.", "bot", botLogo, new Date());
            if (data.reply) speakText(data.reply);
        }, 800);

    } catch {
        typingMsg.remove();
        addMessage("Server error.", "bot", botLogo, new Date());
    }
});

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, sender, imgPath, timestampDate) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("msg-wrapper", sender);

    const img = document.createElement("img");
    img.src = imgPath;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = text;

    const timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");
    timestamp.textContent = formatTime(timestampDate || new Date());

    if (sender === "user") {
        wrapper.appendChild(timestamp);
        wrapper.appendChild(messageDiv);
        wrapper.appendChild(img);
    } else {
        wrapper.appendChild(img);
        wrapper.appendChild(messageDiv);
        wrapper.appendChild(timestamp);
    }

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
    return wrapper;
}

function addTypingIndicator(botImg) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("msg-wrapper", "bot");

    const img = document.createElement("img");
    img.src = botImg;

    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "typing");

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.classList.add("typing-dot");
        typingDiv.appendChild(dot);
    }

    wrapper.appendChild(img);
    wrapper.appendChild(typingDiv);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
    return wrapper;
}

$(document).ready(function () {
    if (localStorage.getItem("theme") === "light") {
        $("body").addClass("light");
        $(".moon").addClass("sun");
        $(".tdnn").addClass("day");
    }
    $(".tdnn").click(function () {
        $("body").toggleClass("light");
        $(".moon").toggleClass("sun");
        $(".tdnn").toggleClass("day");
        localStorage.setItem("theme", $("body").hasClass("light") ? "light" : "dark");
    });
});
