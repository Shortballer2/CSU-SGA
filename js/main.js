let cooldown = false;
let submitted = false;

document.addEventListener("DOMContentLoaded", () => {
  console.log("CSU SGA site loaded.");

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, { threshold: 0.2 });
    reveals.forEach(el => observer.observe(el));
  }

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      if (cooldown) {
        e.preventDefault();
        alert("⏱ Please wait 60 seconds before submitting again.");
      }
    });
  }

  const aboutPages = [
    "/About/",
    "/About/Executives/",
    "/About/Cabinet/",
    "/About/Senators/",
  ];
  const currentPath = window.location.pathname;
  const pageIndex = aboutPages.indexOf(currentPath);
  if (pageIndex !== -1) {
    let navigating = false;

    const goTo = (direction) => {
      const target = pageIndex + direction;
      if (target >= 0 && target < aboutPages.length) {
        navigating = true;
        window.location.href = aboutPages[target];
      }
    };

    window.addEventListener(
      "wheel",
      (e) => {
        if (navigating) return;
        if (e.deltaY > 0) {
          e.preventDefault();
          goTo(1);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          goTo(-1);
        }
      },
      { passive: false }
    );

    let touchStartY = null;
    window.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    });
    window.addEventListener(
      "touchend",
      (e) => {
        if (touchStartY === null) return;
        const deltaY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 50) {
          goTo(deltaY > 0 ? 1 : -1);
        }
        touchStartY = null;
      },
      { passive: true }
    );
  }
});

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

// Prevent resubmission manually handled in DOMContentLoaded above
