// ./src/script.js
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openBtn");
  const landing = document.getElementById("landing");
  const home = document.getElementById("home");
  const guestName = document.getElementById("guest");
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get("n") || "";
  if (nama) {
    guestName.innerText = nama;
  }

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

  // AUTOPLAY MUSIC
  const musicBtn = document.getElementById("musicBtn");
  const bgMusic = document.getElementById("bgMusic");

  let isPlaying = false;

  // Toggle play/pause saat tombol musik diklik
  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.classList.remove("playing");
    } else {
      bgMusic.play();
      musicBtn.classList.add("playing");
    }
    isPlaying = !isPlaying;
  });

  // END
  function lockScroll() {
    // block CSS scrolling
    musicBtn.style.opacity = "0";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventKeys, { passive: false });
  }

  function unlockScroll() {
    musicBtn.style.opacity = "1";
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
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        musicBtn.classList.add("playing");
      })
      .catch((err) => {
        console.log("Autoplay gagal: ", err);
      });
    setTimeout(() => {
      landing.classList.add("hidden");
    }, 500);
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
    // Landing Section Anim
    const allTargets = landingContent.querySelectorAll(
      ".landingChild > *:not(#openBtn)"
    );
    const btn = document.getElementById("openBtn");

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

    // Animasi scroll di section berikutnya
    const allTexts = document.querySelectorAll(".fade-sequence");
    const btnSection = document.querySelectorAll(".fade-opacity-btn");

    allTexts.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "restart none restart none", // biar muncul lagi tiap kali masuk viewport
          scroller: "#home",
        },
        y: -30,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
      });
    });

    btnSection.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "restart none restart none", // sama juga
          scroller: "#home",
        },
        opacity: 0,
        duration: 2,
        ease: "power2.out",
      });
    });
  }

  // SCRIPT COMMENT

  // SCRIPT COMMENT

  const API_URL = "https://filament-sticky-notes-c8na7.kinsta.app/api/comments";
  let currentPage = 1;
  let perPage = 5;

  // Load comments
  async function loadComments(page = 1) {
    const res = await fetch(`${API_URL}?page=${page}&per_page=${perPage}`);
    const data = await res.json();

    // Update count
    document.getElementById("commentCount").innerText = data.total;

    const commentList = document.getElementById("commentList");
    const pagination = document.getElementById("pagination");

    if (data.data.length === 0) {
      commentList.innerHTML = `<p class="text-center text-sm text-gray-200 italic">Belum ada komentar</p>`;
      pagination.innerHTML = "";
      return;
    }

    commentList.innerHTML = data.data
      .map(
        (c) => `
    <div class="pb-6">
      <p class="font-bold text-base flex gap-2">
        ${c.name}
        ${
          c.is_attendance == 1
            ? `<i class="bi bi-check-circle-fill" style="color: #22c55e !important;"></i>`
            : `<i class="bi bi-x-circle-fill" style="color: #ef4444 !important;"></i>`
        }
      </p>
      <p class="mt-1 text-sm leading-relaxed" style="text-align: left !important;">
        ${c.comment ?? ""}
      </p>
    </div>
  `
      )
      .join("");

    renderPagination(data);
  }

  // Render pagination buttons
  function renderPagination(data) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (data.last_page <= 1) return;

    if (data.prev_page_url) {
      const prevBtn = document.createElement("button");
      prevBtn.innerText = "Previous";
      prevBtn.className = "px-3 py-1 text-white hover:underline";
      prevBtn.onclick = () => loadComments(data.current_page - 1);
      pagination.appendChild(prevBtn);
    }

    for (let i = 1; i <= data.last_page; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.innerText = i;
      pageBtn.className =
        "px-3 py-1 rounded-md " +
        (i === data.current_page
          ? "font-bold underline text-white"
          : "text-white hover:underline");
      pageBtn.onclick = () => loadComments(i);
      pagination.appendChild(pageBtn);
    }

    if (data.next_page_url) {
      const nextBtn = document.createElement("button");
      nextBtn.innerText = "Next";
      nextBtn.className = "px-3 py-1 text-white hover:underline";
      nextBtn.onclick = () => loadComments(data.current_page + 1);
      pagination.appendChild(nextBtn);
    }
  }

  // Handle form submit
  document
    .getElementById("commentForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = e.target.querySelector("button[type='submit']");
      btn.disabled = true;
      btn.innerText = "Loading...";

      const payload = {
        name: document.getElementById("name").value.trim(),
        is_attendance: parseInt(document.getElementById("is_attendance").value),
        guest_count:
          parseInt(document.getElementById("guest_count").value) || 0,
        comment: document.getElementById("comment").value.trim(),
      };

      // Validasi biar semua field wajib
      if (!payload.name || payload.is_attendance === null || !payload.comment) {
        btn.disabled = false;
        btn.innerText = "Send";
        return;
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(payload);
      console.log(res);

      btn.disabled = false;
      btn.innerText = "Send";

      if (res.ok) {
        document.getElementById("commentForm").reset();
        document.getElementById("is_attendance").value = "";

        // Alert sukses
        const alert = document.createElement("p");
        alert.innerText = "Komen berhasil dikirim";
        alert.style.color = "#32a850";
        document.getElementById("commentForm").appendChild(alert);

        setTimeout(() => alert.remove(), 2000);

        loadComments(1);
      }
    });

  // Attendance dropdown
  const attendanceBtn = document.getElementById("attendanceBtn");
  const attendanceText = document.getElementById("attendanceText");
  const attendanceOptions = document.getElementById("attendanceOptions");
  const attendanceInput = document.getElementById("is_attendance");

  attendanceBtn.addEventListener("click", () => {
    attendanceOptions.classList.toggle("hidden");
  });

  attendanceOptions.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const value = item.getAttribute("data-value");
      const label = item.innerText;
      attendanceInput.value = value;
      attendanceText.innerText = label;
      attendanceText.classList.remove("text-gray-500");
      attendanceOptions.classList.add("hidden");

      const guestWrapper = document.getElementById("guestWrapper");
      const guestSelect = document.getElementById("guest_count");

      if (value === "1") {
        guestWrapper.classList.remove("hidden");
        guestSelect.setAttribute("required", "true"); // wajib diisi kalau Yes
      } else {
        guestWrapper.classList.add("hidden");
        guestSelect.removeAttribute("required"); // hilangin required kalau bukan Yes
        guestSelect.value = ""; // reset nilai
      }
    });
  });

  // Guest dropdown
  const guestBtn = document.getElementById("guestBtn");
  const guestText = document.getElementById("guestText");
  const guestOptions = document.getElementById("guestOptions");
  const guestInput = document.getElementById("guest_count");

  guestBtn.addEventListener("click", () => {
    guestOptions.classList.toggle("hidden");
  });

  guestOptions.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const value = item.getAttribute("data-value");
      const label = item.innerText;
      guestInput.value = value;
      guestText.innerText = label;
      guestText.classList.remove("text-gray-500");
      guestOptions.classList.add("hidden");
    });
  });

  // Initial load
  loadComments();

  // END SCRIPT COMMENT
});
