// ./src/script.js
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openBtn");
  const landing = document.getElementById("landing");
  const home = document.getElementById("home");

  if (!openBtn || !landing || !home) return;

  // --- Prevent default helpers ---
  const preventDefault = (e) => {
    e.preventDefault();
  };

  const preventKeys = (e) => {
    // block navigation keys that cause scrolling
    const blocked = [
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ];
    if (blocked.includes(e.key)) e.preventDefault();
  };

  function lockScroll() {
    // block CSS scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventKeys, { passive: false });
  }

  function unlockScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    window.removeEventListener("wheel", preventDefault);
    window.removeEventListener("touchmove", preventDefault);
    window.removeEventListener("keydown", preventKeys);

    landing.style.position = "";
    landing.style.inset = "";
    landing.style.width = "";
    landing.style.height = "";
    landing.style.zIndex = "";
  }

  lockScroll();
  window.scrollTo(0, 0);

  openBtn.addEventListener("click", (ev) => {
    ev.preventDefault();

    unlockScroll();
    document.body.classList.remove("overflow-hidden"); // in case you use Tailwind class

    home.scrollIntoView({ behavior: "smooth", block: "start" });

    // hide landing when #home is visible using IntersectionObserver (more reliable than setTimeout)
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // small delay to let scroll finish visually
            setTimeout(() => {
              landing.style.display = "none";
            }, 80);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    io.observe(home);
  });

  // COUNTDOWN SCRIPT

  const targetDate = new Date("2025-09-20T00:00:00").getTime();

  const countdownFunc = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(countdownFunc);
      document.getElementById("countdown").innerHTML =
        "<p class='text-2xl font-bold'>🎉 Happy Wedding Day 🎉</p>";
      return;
    }

    // Hitung waktu
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
  }, 1000);
  //  END COUNTDOWN SCRIPT

  // GSAP SCRIPT

  if (window.gsap && landingContent) {
    // semua child kecuali tombol (#openBtn)
    const allTargets = landingContent.querySelectorAll(
      ".landingChild > *:not(#openBtn)"
    );
    const btn = document.getElementById("openBtn");

    // Fade-in untuk semua elemen kecuali tombol (staggered)
    gsap.from(allTargets, {
      y: -30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.25,
    });

    if (btn) {
      gsap.set(btn, { opacity: 1, transformOrigin: "50% 50%" });

      gsap.from(btn, {
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.5)",
        delay: 0.5,
      });
    }
  }
});
