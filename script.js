/* ==========================================================================
   Klim Nabu — landing page behaviour
   Small, dependency-free enhancements: scroll reveal, sticky nav state,
   scroll-spy, reading progress, pointer spotlight, card tilt, copy-to-clipboard.
   ========================================================================== */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;

/* ── footer year ─────────────────────────────────────────────────────────── */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── reveal on scroll ────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Stagger siblings that appear together for a softer cascade.
        const siblings = Array.from(entry.target.parentElement.children).filter((el) =>
          el.classList.contains("reveal")
        );
        const index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ── mobile menu ─────────────────────────────────────────────────────────── */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.hidden = !open;
  };

  menuBtn.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuBtn.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) setMenu(false);
  });
}

/* ── sticky nav state + reading progress ─────────────────────────────────── */
const nav = document.getElementById("nav");
const progressBar = document.getElementById("progressBar");

let ticking = false;

function onScroll() {
  const y = window.scrollY;

  if (nav) nav.classList.toggle("is-stuck", y > 12);

  if (progressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  updateActivePill(y);
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  },
  { passive: true }
);

/* ── scroll spy ──────────────────────────────────────────────────────────── */
const pillLinks = Array.from(document.querySelectorAll(".pill[data-link]"));
const spySections = pillLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateActivePill(y) {
  if (!spySections.length) return;

  const marker = window.innerHeight * 0.35;
  let current = spySections[0];

  spySections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) current = section;
  });

  // Stay on "Contact" once the bottom of the page is reached.
  if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) {
    current = spySections[spySections.length - 1];
  }

  pillLinks.forEach((link) => {
    const matches = link.getAttribute("href") === `#${current.id}`;
    link.classList.toggle("is-active", matches);
    if (matches) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

onScroll();

/* ── pointer spotlight ───────────────────────────────────────────────────── */
const spotlight = document.getElementById("spotlight");

if (spotlight && !prefersReducedMotion && !isTouch) {
  let raf = null;
  let px = window.innerWidth / 2;
  let py = window.innerHeight * 0.2;

  window.addEventListener(
    "pointermove",
    (event) => {
      px = event.clientX;
      py = event.clientY;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        spotlight.style.setProperty("--mx", `${px}px`);
        spotlight.style.setProperty("--my", `${py}px`);
        raf = null;
      });
    },
    { passive: true }
  );
}

/* ── subtle card tilt ────────────────────────────────────────────────────── */
if (!prefersReducedMotion && !isTouch) {
  const MAX_TILT = 5;

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `perspective(900px) rotateX(${(-relY * MAX_TILT).toFixed(2)}deg) ` +
        `rotateY(${(relX * MAX_TILT).toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

/* ── copy email ──────────────────────────────────────────────────────────── */
const copyBtn = document.getElementById("copyEmail");

if (copyBtn) {
  const label = copyBtn.querySelector("span");
  const original = label ? label.textContent : "";
  let resetTimer = null;

  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.dataset.email || "";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback for browsers without the async clipboard API.
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }

    if (!label) return;
    copyBtn.classList.add("is-copied");
    label.textContent = "Copied ✓";

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      copyBtn.classList.remove("is-copied");
      label.textContent = original;
    }, 2000);
  });
}
