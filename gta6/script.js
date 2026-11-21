/* ==========================================================================
   GTA VI concept page — interactions
   Boot curtain, Vice City clock, uptime counter, scroll reveal + spy,
   parallax, trailer modal, edition toasts.
   ========================================================================== */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;

/* ── boot curtain ────────────────────────────────────────────────────────── */
const boot = document.getElementById("boot");
if (boot) {
  const hide = () => boot.classList.add("is-done");
  // Let the load bar finish, then lift the curtain.
  setTimeout(hide, prefersReduced ? 120 : 1150);
  window.addEventListener("load", () => setTimeout(hide, prefersReduced ? 0 : 450));
}

/* ── Vice City clock (UTC-5, no DST: the game's Florida runs on its own time) */
const clockEl = document.getElementById("vcClock");
const pad2 = (n) => String(n).padStart(2, "0");

function viceCityTime() {
  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const vcMinutes = (utcMinutes - 5 * 60 + 1440) % 1440;
  return `${pad2(Math.floor(vcMinutes / 60))}:${pad2(vcMinutes % 60)}`;
}

function tickClock() {
  if (clockEl) clockEl.textContent = viceCityTime();
}
tickClock();
setInterval(tickClock, 15000);

/* ── "out for" uptime counter ───────────────────────────────────────────── */
const RELEASE = Date.UTC(2026, 10, 19, 0, 0, 0); // 19 Nov 2026
const co = {
  days: document.getElementById("coDays"),
  hours: document.getElementById("coHours"),
  mins: document.getElementById("coMins"),
  secs: document.getElementById("coSecs"),
};

function tickUptime() {
  if (!co.days) return;
  const elapsed = Math.max(0, Date.now() - RELEASE);
  const totalSeconds = Math.floor(elapsed / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  co.days.textContent = String(days).padStart(2, "0");
  co.hours.textContent = pad2(hours);
  co.mins.textContent = pad2(mins);
  co.secs.textContent = pad2(secs);
}
tickUptime();
setInterval(tickUptime, 1000);

/* ── reveal on scroll ───────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll(".reveal");

if (prefersReduced || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = Array.from(entry.target.parentElement.children).filter((el) =>
          el.classList.contains("reveal")
        );
        const index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(index, 4) * 80}ms`;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ── sticky nav + scroll spy + parallax ─────────────────────────────────── */
const nav = document.getElementById("nav");
const spyLinks = Array.from(document.querySelectorAll("[data-spy]"));
const spyTargets = spyLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const heroImg = document.getElementById("heroImg");
const storyImg = document.querySelector("[data-parallax-img]");

let queued = false;

function onFrame() {
  const y = window.scrollY;

  if (nav) nav.classList.toggle("is-stuck", y > 20);

  // Scroll spy
  const marker = window.innerHeight * 0.35;
  let active = null;
  spyTargets.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) active = section;
  });
  spyLinks.forEach((link) => {
    const match = active && link.getAttribute("href") === `#${active.id}`;
    link.classList.toggle("is-active", Boolean(match));
  });

  // Light parallax on the poster; the hero has its own slow drift.
  if (storyImg && !prefersReduced && !isTouch) {
    const rect = storyImg.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = 1 - rect.top / window.innerHeight;
      storyImg.style.transform = `translateY(${(-8 + progress * 8).toFixed(2)}%) scale(1.04)`;
    }
  }

  if (heroImg && !prefersReduced) {
    heroImg.style.translate = `0 ${Math.min(y * 0.12, 90).toFixed(1)}px`;
  }

  queued = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(onFrame);
  },
  { passive: true }
);
onFrame();

/* ── pointer glow ───────────────────────────────────────────────────────── */
const glow = document.getElementById("glow");
if (glow && !prefersReduced && !isTouch) {
  let raf = null;
  let gx = window.innerWidth / 2;
  let gy = window.innerHeight * 0.3;
  window.addEventListener(
    "pointermove",
    (event) => {
      gx = event.clientX;
      gy = event.clientY;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        glow.style.setProperty("--mx", `${gx}px`);
        glow.style.setProperty("--my", `${gy}px`);
        raf = null;
      });
    },
    { passive: true }
  );
}

/* ── mobile menu ────────────────────────────────────────────────────────── */
const burger = document.getElementById("burger");
const sheet = document.getElementById("navSheet");

if (burger && sheet) {
  const setOpen = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    sheet.hidden = !open;
  };
  burger.addEventListener("click", () => setOpen(burger.getAttribute("aria-expanded") !== "true"));
  sheet.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      burger.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) setOpen(false);
  });
}

/* ── trailer modal ──────────────────────────────────────────────────────── */
const modal = document.getElementById("modal");
const openers = [document.getElementById("trailerBtn"), document.getElementById("mediaPlay")].filter(Boolean);
let lastFocus = null;

function openModal() {
  if (!modal) return;
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

openers.forEach((btn) => btn.addEventListener("click", openModal));
if (modal) {
  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal();
      // A "Buy now" inside the modal still jumps to the editions.
      if (el.classList.contains("btn-buy")) {
        const target = document.querySelector("#editions");
        if (target) target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      }
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

/* ── edition buttons → toast ────────────────────────────────────────────── */
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-on"), 3200);
}

document.querySelectorAll("[data-edition]").forEach((btn) => {
  btn.addEventListener("click", () => {
    showToast(`${btn.dataset.edition} Edition reserved — this is a concept page, so nothing was charged.`);
  });
});

/* ── subtle keyboard hint for trailer ───────────────────────────────────── */
document.addEventListener("keydown", (event) => {
  const tag = (event.target && event.target.tagName) || "";
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (event.key === "t" && modal && modal.hidden) openModal();
});
