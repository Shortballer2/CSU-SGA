const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = window.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY";

const messages = [
  {
    role: "system",
    content: `You are the Charleston Southern University Student Government Association assistant.
Ask the user if they'd like to submit an idea or contact us.
For idea submissions, collect: type of submission (General Feedback or Legislation Idea), category (Campus Life, Campus Recreation, Residence Life, Dining Services, Library, Counseling, Other), detailed description, name (optional), and email (optional).
For contact requests, collect their name, email, and message.
Ask questions one at a time and keep responses short. After collecting information, summarize it back to the user and thank them.`
  }
];

function addMessage(role, text) {
  const msgContainer = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = `chat-${role}`;
  div.textContent = text;
  msgContainer.appendChild(div);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

async function sendMessage(userText) {
  addMessage("user", userText);
  messages.push({ role: "user", content: userText });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I had trouble responding.";
    addMessage("assistant", reply);
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    console.error(err);
    addMessage("assistant", "An error occurred. Please try again later.");
  }
}

// Initialize chatbot
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  addMessage("assistant", "Hi! Would you like to submit an idea or contact us?");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });
});
