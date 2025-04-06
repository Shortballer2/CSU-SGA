document.addEventListener("DOMContentLoaded", function () {
  console.log("Dawson & Mathis campaign site loaded.");

  // 📅 Render campaign events (if calendar exists)
  const events = [
    {
      title: "Campaign Kickoff Rally",
      date: "March 27, 2025",
      location: "Student Center Lawn",
      description: "Join us for free snacks, music, and a meet & greet with Hannah and Shane!"
    },
    {
      title: "Open Q&A with the Candidates",
      date: "April 2, 2025",
      location: "Library Auditorium",
      description: "Bring your questions — we want to hear your voice."
    },
    {
      title: "Final Debate Night",
      date: "April 10, 2025",
      location: "Campus Theater",
      description: "Come see us go head-to-head with other candidates."
    }
  ];

  const calendar = document.getElementById("calendar");
  if (calendar) {
    events.forEach(event => {
      const div = document.createElement("div");
      div.classList.add("event");
      div.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
      `;
      calendar.appendChild(div);
    });
  }

  // 📩 Show a confirmation message
  function showMessage(target, message, isSuccess = true) {
    const div = document.createElement("div");
    div.className = isSuccess ? "form-success" : "form-error";
    div.textContent = message;
    target.appendChild(div);
    setTimeout(() => div.remove(), 5000); // auto-remove after 5s
  }

  // 📨 Handle IDEA form
  const ideaForm = document.getElementById("idea-form");
  if (ideaForm) {
    ideaForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        followup: ideaForm.followup?.value || "Anonymous",
        name: ideaForm.name?.value || "",
        email: ideaForm.email?.value || "",
        submission_type: ideaForm.submission_type?.value || "General",
        category: ideaForm.category?.value || "",
        description: ideaForm.description?.value || ""
      };

      try {
        const response = await fetch("https://campaign-backend-oixn.onrender.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        showMessage(ideaForm, "✅ " + result.message, true);
        ideaForm.reset();
      } catch (error) {
        showMessage(ideaForm, "❌ Error: Failed to send idea.", false);
      }
    });
  }

  // 📬 Handle CONTACT form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        name: contactForm.name?.value || "",
        email: contactForm.email?.value || "",
        message: contactForm.message?.value || ""
      };

      try {
        const response = await fetch("https://campaign-backend-oixn.onrender.com/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        showMessage(contactForm, "✅ " + result.message, true);
        contactForm.reset();
      } catch (error) {
        showMessage(contactForm, "❌ Error: Failed to send message.", false);
      }
    });
  }
});
