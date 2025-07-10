document.addEventListener("DOMContentLoaded", function () {
  console.log("CSU SGA site loaded.");
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
