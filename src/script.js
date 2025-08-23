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

  const musicBtn = document.getElementById("musicBtn");
  const musicIcon = document.getElementById("musicIcon");
  const bgMusic = document.getElementById("bgMusic");

  let isPlaying = false;

  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      bgMusic.pause();
      musicIcon.classList.remove("bi-pause-fill");
      musicIcon.classList.add("bi-play-fill");
    } else {
      bgMusic.play();
      musicIcon.classList.remove("bi-play-fill");
      musicIcon.classList.add("bi-pause-fill");
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
  // Attendance dropdown
  const attendanceBtn = document.getElementById("attendanceBtn");
  const attendanceText = document.getElementById("attendanceText");
  const attendanceOptions = document.getElementById("attendanceOptions");
  const attendanceInput = document.getElementById("is_attendance");

  // Guest dropdown
  const guestBtn = document.getElementById("guestBtn");
  const guestText = document.getElementById("guestText");
  const guestOptions = document.getElementById("guestOptions");
  const guestInput = document.getElementById("guest_count");

  // Fungsi tutup semua dropdown
  function closeAllDropdowns() {
    attendanceOptions.classList.add("hidden");
    guestOptions.classList.add("hidden");

    // reset icon kalau pakai arrow dinamis
    attendanceBtn.querySelector("i").classList.remove("bi-chevron-up");
    attendanceBtn.querySelector("i").classList.add("bi-chevron-down");

    guestBtn.querySelector("i").classList.remove("bi-chevron-up");
    guestBtn.querySelector("i").classList.add("bi-chevron-down");
  }

  // Toggle attendance
  attendanceBtn.addEventListener("click", () => {
    const isHidden = attendanceOptions.classList.contains("hidden");
    closeAllDropdowns();
    if (isHidden) {
      attendanceOptions.classList.remove("hidden");
      attendanceBtn.querySelector("i").classList.remove("bi-chevron-down");
      attendanceBtn.querySelector("i").classList.add("bi-chevron-up");
    }
  });

  // Pilih attendance
  attendanceOptions.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const value = item.getAttribute("data-value");
      const label = item.innerText;
      attendanceInput.value = value;
      attendanceText.innerText = label;
      attendanceText.classList.remove("text-gray-500");
      closeAllDropdowns();

      const guestWrapper = document.getElementById("guestWrapper");
      if (value === "1") {
        guestWrapper.classList.remove("hidden");
        guestInput.setAttribute("required", "true");
      } else {
        guestWrapper.classList.add("hidden");
        guestInput.removeAttribute("required");
        guestInput.value = "";
        guestText.innerText = "Guest Count";
        guestText.classList.add("text-gray-500");
      }
    });
  });

  // Toggle guest
  guestBtn.addEventListener("click", () => {
    const isHidden = guestOptions.classList.contains("hidden");
    closeAllDropdowns();
    if (isHidden) {
      guestOptions.classList.remove("hidden");
      guestBtn.querySelector("i").classList.remove("bi-chevron-down");
      guestBtn.querySelector("i").classList.add("bi-chevron-up");
    }
  });

  // Pilih guest
  guestOptions.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const value = item.getAttribute("data-value");
      const label = item.innerText;
      guestInput.value = value;
      guestText.innerText = label;
      guestText.classList.remove("text-gray-500");
      closeAllDropdowns();
    });
  });

  // Tutup semua kalau klik di luar
  document.addEventListener("click", (e) => {
    if (
      !attendanceBtn.contains(e.target) &&
      !attendanceOptions.contains(e.target) &&
      !guestBtn.contains(e.target) &&
      !guestOptions.contains(e.target)
    ) {
      closeAllDropdowns();
    }
  });

  // Initial load
  loadComments();

  // END SCRIPT COMMENT

  // script hide show wedding gift card
  // toggleGiftCard();
  // function toggleGiftCard() {
  //   const btn = document.getElementById("hadiahBtn");
  //   const container = document.getElementById("hadiahCards");

  //   btn.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     const isHidden = container.classList.contains("hidden");

  //     if (isHidden) {
  //       // show container then animate cards in sequence
  //       container.classList.remove("hidden");
  //       btn.setAttribute("aria-expanded", "true");

  //       const cards = container.querySelectorAll(".card");
  //       // pastikan state awal tiap card
  //       gsap.set(cards, { y: -20, opacity: 0, pointerEvents: "none" });
  //       // animate masuk, stagger agar 1 lalu 2
  //       gsap.to(cards, {
  //         y: 0,
  //         opacity: 1,
  //         pointerEvents: "auto",
  //         duration: 0.45,
  //         ease: "power2.out",
  //         stagger: 0.14,
  //       });
  //     } else {
  //       // animate keluar dan setelah selesai sembunyikan container
  //       btn.setAttribute("aria-expanded", "false");
  //       const cards = Array.from(container.querySelectorAll(".card"));
  //       // animate reverse order agar terlihat bagus (card2 dulu lalu card1)
  //       gsap.to(cards.reverse(), {
  //         y: -20,
  //         opacity: 0,
  //         duration: 0.32,
  //         ease: "power2.in",
  //         stagger: 0.12,
  //         onComplete: () => {
  //           // kembalikan beberapa gaya inline bersih supaya show berikutnya konsisten
  //           cards.forEach((c) => {
  //             gsap.set(c, { clearProps: "transform,opacity,pointerEvents" });
  //           });
  //           container.classList.add("hidden");
  //         },
  //       });
  //     }
  //   });

  //   // COPY button logic: bekerja untuk semua kartu kapan pun
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const card = btn.closest(".card");
      if (!card) return;
      const numberEl = card.querySelector(".card-number");
      const txt = numberEl ? numberEl.textContent.trim() : "";
      if (!txt) return;

      const originalHtml = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(txt);
        btn.innerHTML = "✓ Tersalin";
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 1200);
      } catch (err) {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = txt;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          btn.innerHTML = "✓ Tersalin";
          setTimeout(() => {
            btn.innerHTML = originalHtml;
          }, 1200);
        } catch (e) {
          alert("Gagal menyalin: " + e);
        }
        document.body.removeChild(ta);
      }
    });
  });
  // }
  animateGallery();
  function animateGallery() {
    const items = document.querySelectorAll(".gallery-item");
    if (!items.length) return;

    // set awal semua item
    gsap.set(items, { y: -30, opacity: 0 });

    const itemsArr = Array.from(items);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const idx = itemsArr.indexOf(el);
          const delay = Math.min(idx * 0.06, 0.6);

          if (entry.isIntersecting) {
            // animasi masuk
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              delay,
            });
          } else {
            // animasi keluar (biar bisa infinite ketika scroll bolak-balik)
            gsap.to(el, {
              y: -30,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
            });
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
      }
    );

    itemsArr.forEach((it) => io.observe(it));
  }

  // end
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("close-lightbox");
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      lightboxImg.src = item.src; // ambil src gambar
      lightbox.classList.remove("hidden"); // tampilkan modal
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.classList.add("hidden"); // sembunyikan modal
  });

  // biar bisa close kalau klik area hitam
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add("hidden");
    }
  });
});
