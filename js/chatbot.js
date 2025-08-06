const API_URL = "/api/chat";

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
  if (!msgContainer) return;
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
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

window.addEventListener("DOMContentLoaded", () => {
  // create toggle button
  const chatBtn = document.createElement("button");
  chatBtn.id = "chatbot-toggle";
  chatBtn.setAttribute("aria-label", "Open chatbot");
  chatBtn.innerHTML = '<i class="fa-solid fa-comment-dots"></i>';
  document.body.appendChild(chatBtn);

  // create popup
  const popup = document.createElement("div");
  popup.id = "chatbot-popup";
  popup.classList.add("hidden");
  popup.innerHTML = `
    <div class="chatbot-header">
      <span>CSU SGA Chatbot</span>
      <button id="chatbot-close" type="button" aria-label="Close">&times;</button>
    </div>
    <div id="chat-messages" class="chat-messages"></div>
    <form id="chat-form" class="chat-input">
      <input id="user-input" type="text" placeholder="Type your message..." autocomplete="off" />
      <button type="submit" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>
    </form>
  `;
  document.body.appendChild(popup);

  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const closeBtn = document.getElementById("chatbot-close");

  chatBtn.addEventListener("click", () => {
    popup.classList.toggle("hidden");
    if (!popup.classList.contains("hidden") && messages.length === 1) {
      const greeting = "Hi! Would you like to submit an idea or contact us?";
      addMessage("assistant", greeting);
      messages.push({ role: "assistant", content: greeting });
    }
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });

  document.querySelectorAll(".open-chatbot").forEach((el) => {
    el.addEventListener("click", () => chatBtn.click());
  });
});
