let cooldown = false;
let submitted = false;

document.addEventListener("DOMContentLoaded", () => {
  console.log("CSU SGA site loaded.");

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    reveals.forEach(el => observer.observe(el));
  }

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      if (cooldown || submitted) {
        e.preventDefault();
        alert("⏱ Please wait 60 seconds before submitting again.");
        return;
      }
      submitted = true;
    });
  }

  const segments = window.location.pathname
    .replace(/\/index\.html$/, "")
    .split("/")
    .filter(Boolean);
  const aboutIdx = segments.indexOf("About");
  if (aboutIdx !== -1) {
    const subpages = ["", "Executives", "Cabinet", "Senators"];  
    const currentSub = segments[aboutIdx + 1] || "";
    const pageIndex = subpages.indexOf(currentSub);
    if (pageIndex !== -1) {
      let navigating = false;

      const goTo = (direction) => {
        const target = pageIndex + direction;
        if (target >= 0 && target < subpages.length) {
          navigating = true;
          const newSegments = segments.slice(0, aboutIdx + 1);
          if (subpages[target]) newSegments.push(subpages[target]);
          window.location.href = "/" + newSegments.join("/") + "/";
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
