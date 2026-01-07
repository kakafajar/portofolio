// Load file HTML ke dalam div target
async function loadSection(id, file) {
  const el = document.getElementById(id);
  // Check if element exists to avoid errors
  if (!el) return;

  try {
    const res = await fetch(`components/${file}`);
    if (!res.ok) throw new Error(`Failed to load ${file}`);
    const html = await res.text();
    el.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

// Load Sections with Promise.all to ensure AOS inits after content
const sections = [
  loadSection("navbar", "navbar.html").then(() => {
    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    const toggleSidebar = () => {
      if (!sidebar) return; // Guard clause
      const isOpen = !sidebar.classList.contains("translate-x-full");

      if (isOpen) {
        // Close
        sidebar.classList.add("translate-x-full");
        if (overlay) {
          overlay.classList.add("hidden");
          overlay.classList.remove("opacity-100");
        }
        if (menuBtn) menuBtn.classList.remove("hamburger-active");
      } else {
        // Open
        sidebar.classList.remove("translate-x-full");
        if (overlay) {
          overlay.classList.remove("hidden");
          setTimeout(() => overlay.classList.add("opacity-100"), 10);
        }
        if (menuBtn) menuBtn.classList.add("hamburger-active");
      }
    };

    if (menuBtn) menuBtn.addEventListener("click", toggleSidebar);
    if (overlay) overlay.addEventListener("click", toggleSidebar);

    if (mobileLinks) {
      mobileLinks.forEach(link => {
        link.addEventListener("click", toggleSidebar);
      });
    }
  }),
  loadSection("hero", "hero.html"),
  loadSection("about", "about.html"),
  loadSection("keahlian", "keahlian.html"),
  loadSection("career", "career.html"),
  loadSection("projects", "projects.html"),
  loadSection("sertifikat", "sertifikat.html").then(() => {
    const grid = document.querySelector("#sertifikat .grid");
    const items = grid ? grid.children : [];
    const btnContainer = document.getElementById("sertifikat-btn-container");
    const btn = document.getElementById("show-more-sertifikat");
    const itemsToShow = 4;

    if (items.length > itemsToShow) {
      // Hide items beyond index 3 (4th item)
      for (let i = itemsToShow; i < items.length; i++) {
        items[i].classList.add("hidden");
      }

      if (btn) {
        btn.addEventListener("click", () => {
          for (let i = itemsToShow; i < items.length; i++) {
            items[i].classList.remove("hidden");
            // Refresh AOS if needed, or trigger a simple fade in
            items[i].classList.add("fade-up-enter"); // Optional: add a class for animation if defined
          }
          btnContainer.classList.add("hidden");
        });
      }
    } else {
      // If items are less than or equal to limit, hide the button
      if (btnContainer) btnContainer.classList.add("hidden");
    }
  }),
  loadSection("contact", "contact.html"),
  loadSection("footer", "footer.html")
];

Promise.all(sections).then(() => {
  // Initialize AOS after all sections are loaded
  if (typeof AOS !== 'undefined') {
    setTimeout(() => {
      AOS.init({
        once: true,
        duration: 800,
        offset: 50, // trigger earlier
      });
      // Refresh to ensure all elements are caught
      AOS.refresh();
    }, 100);
  }
});

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset * 0.3;
  document.documentElement.style.setProperty("--scroll", scrolled + "px");
});
