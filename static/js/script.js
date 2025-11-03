const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

// Image paths
const userLogo = "/static/images/user-logo.png";
const botLogo = "/static/images/bot-logo.png";

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = userInput.value.trim();
    if (!msg) return;

    addMessage(msg, "user", userLogo, new Date()); // Use current time
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

            // Use backend timestamp if available, otherwise current time
            const botTime = data.timestamp ? new Date(data.timestamp) : new Date();
            addMessage(data.reply || "Sorry, something went wrong.", "bot", botLogo, botTime);

        }, 500 + Math.random() * 500); // Random delay 0.5-1s

    } catch (err) {
        typingMsg.remove();
        addMessage("Sorry, something went wrong.", "bot", botLogo, new Date());
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
    img.alt = sender;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = text;

    const timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");
    timestamp.textContent = formatTime(timestampDate);

    if (sender === "user") {
        // Left side: time | message | image
        wrapper.appendChild(timestamp);
        wrapper.appendChild(messageDiv);
        wrapper.appendChild(img);
    } else {
        // Right side: image | message | time
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
    img.alt = "bot";

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

// DARK/LIGHT TOGGLE
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

        if ($("body").hasClass("light")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    });
});
