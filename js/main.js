// main.js

document.addEventListener("DOMContentLoaded", function () {
  console.log("Dawson & Mathis campaign site loaded.");

  // 📅 Campaign events
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

  // 📨 IDEA FORM submission
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
        alert("✅ " + result.message);
        ideaForm.reset();
      } catch (error) {
        alert("❌ Error: Failed to send idea.");
      }
    });
  }

  // 📩 CONTACT FORM submission
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
        alert("✅ " + result.message);
        contactForm.reset();
      } catch (error) {
        alert("❌ Error: Failed to send message.");
      }
    });
  }
});
