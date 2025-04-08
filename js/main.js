document.addEventListener("DOMContentLoaded", function () {
  console.log("Dawson & Mathis campaign site loaded.");
})

let cooldown = false;

function showSuccessMessage() {
  document.getElementById("form-success").style.display = "block";
  document.getElementById("idea-form")?.reset();
  document.getElementById("contact-form")?.reset();
  submitted = false;

  // Disable submit button for 60 seconds
  const button = document.querySelector("form button[type='submit']");
  if (button) {
    button.disabled = true;
    button.textContent = "Submitted (wait 60s)";
    cooldown = true;

    setTimeout(() => {
      button.disabled = false;
      button.textContent = "Submit";
      cooldown = false;
    }, 60000); // 60,000 ms = 60 seconds
  }
}

// Prevent resubmission manually
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      if (cooldown) {
        e.preventDefault();
        alert("⏱ Please wait 60 seconds before submitting again.");
      }
    });
  }
});

// About Page toggle
  function showCandidate(id) {
    const hannah = document.getElementById("candidate-hannah");
    const shane = document.getElementById("candidate-shane");

    // Hide both with slide-out
    [hannah, shane].forEach(c => {
      c.classList.remove("show");
      c.classList.add("hide");
    });

    // Delay to let hide animation finish before showing the new one
    setTimeout(() => {
      if (id === "hannah") {
        hannah.classList.remove("hide");
        hannah.classList.add("show");
        shane.style.display = "none";
        hannah.style.display = "flex";
      } else {
        shane.classList.remove("hide");
        shane.classList.add("show");
        hannah.style.display = "none";
        shane.style.display = "flex";
      }
    }, 200); // Match this with your CSS animation duration
  }