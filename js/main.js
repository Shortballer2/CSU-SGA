// main.js

// Placeholder for future interactivity
// Example: dynamic calendar loading, form validation, etc.

document.addEventListener("DOMContentLoaded", function () {
  console.log("Dawson & Mathis campaign site loaded.");

  // Future: Add calendar rendering or form handlers here
});


document.addEventListener("DOMContentLoaded", () => {
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
});
