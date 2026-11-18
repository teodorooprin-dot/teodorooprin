/* =====================================================
   THEODORO OPRIN PORTFOLIO SCRIPT
   1. Setup   2. Hamburger menu   3. Active link
   4. Scroll animations   5. Lightbox
   ===================================================== */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var header = document.querySelector(".site-header");

  /* ---------- 1. SETUP ---------- */
  document.documentElement.classList.add("js");   // lets the CSS know JavaScript is running
  $("year").textContent = new Date().getFullYear(); // footer year

  // Adds a soft border under the header once the page is scrolled
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. HAMBURGER MENU (mobile) ---------- */
  var menuBtn = $("menuBtn"), menu = $("menu");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  // Close the menu after choosing a link
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  // Close with the Escape key or by clicking outside the menu
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", function (e) {
    if (menu.classList.contains("open") && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  /* ---------- 3. ACTIVE NAVIGATION LINK ----------
     Highlights the menu link of the section that is on screen. */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = links.map(function (l) { return document.querySelector(l.getAttribute("href")); });

  function setActive(id) {
    links.forEach(function (l) {
      var on = l.getAttribute("href") === "#" + id;
      l.classList.toggle("active", on);
      if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
  setActive("home");

  /* ---------- 4. SCROLL ANIMATIONS ----------
     Elements with class "reveal" fade in when they enter the screen. */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var show = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 90 + "ms"; show.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 5. LIGHTBOX ---------- */
  var lb = $("lightbox"), lbImg = $("lbImg"), lbCap = $("lbCap");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var current = 0, lastFocus = null;

  // Shows the photo at position i (wraps around at both ends)
  function showPhoto(i) {
    current = (i + items.length) % items.length;
    var img = items[current].querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = items[current].parentNode.querySelector("figcaption").textContent;
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    showPhoto(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $("lbClose").focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  items.forEach(function (btn, i) { btn.addEventListener("click", function () { openLightbox(i); }); });
  $("lbClose").addEventListener("click", closeLightbox);
  $("lbPrev").addEventListener("click", function () { showPhoto(current - 1); });
  $("lbNext").addEventListener("click", function () { showPhoto(current + 1); });
  // Clicking the dark background closes the viewer
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  // Keyboard: Esc closes, arrow keys change photo, Tab stays inside the viewer
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") showPhoto(current - 1);
    else if (e.key === "ArrowRight") showPhoto(current + 1);
    else if (e.key === "Tab") {
      var f = [$("lbClose"), $("lbPrev"), $("lbNext")];
      var idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
})();
