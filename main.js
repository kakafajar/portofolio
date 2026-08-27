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
const sectionMappings = [
  { id: "navbar", file: "navbar.html", callback: initNavbar },
  { id: "hero", file: "hero.html" },
  { id: "about", file: "about.html" },
  { id: "keahlian", file: "keahlian.html" },
  { id: "career", file: "career.html", callback: initLightbox },
  { id: "projects", file: "projects.html" },
  { id: "sertifikat", file: "sertifikat.html", callback: initSertifikat },
  { id: "contact", file: "contact.html", callback: initContact },
  { id: "footer", file: "footer.html" }
];

function initNavbar() {
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  const toggleSidebar = () => {
    if (!sidebar) return;
    const isOpen = !sidebar.classList.contains("translate-x-full");

    if (isOpen) {
      sidebar.classList.add("translate-x-full");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.classList.remove("opacity-100");
      }
      if (menuBtn) menuBtn.classList.remove("hamburger-active");
    } else {
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
    mobileLinks.forEach(link => link.addEventListener("click", toggleSidebar));
  }
}

function initLightbox() {
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("close-lightbox");

  if (!lightbox || !lightboxImg) return;

  const closeLightbox = () => {
    lightbox.classList.add("opacity-0");
    if (lightboxImg) lightboxImg.classList.add("scale-95");
    setTimeout(() => {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
    }, 200);
  };

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Preview Foto";
    if (lightboxCaption) {
      if (alt && alt.trim()) {
        lightboxCaption.textContent = alt;
        lightboxCaption.classList.remove("hidden");
      } else {
        lightboxCaption.classList.add("hidden");
      }
    }
    lightbox.classList.remove("hidden");
    setTimeout(() => {
      lightbox.classList.remove("opacity-0");
      if (lightboxImg) lightboxImg.classList.remove("scale-95");
    }, 10);
  };

  const careerSection = document.getElementById("career");
  if (careerSection) {
    careerSection.addEventListener("click", (e) => {
      // Do not trigger preview if clicking links or action buttons
      if (e.target.closest("a") || e.target.closest("button")) return;

      const targetImg = e.target.closest("img") || (e.target.closest(".relative") ? e.target.closest(".relative").querySelector("img") : null);
      if (targetImg && targetImg.src) {
        openLightbox(targetImg.src, targetImg.alt);
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.id === "image-lightbox") {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
      closeLightbox();
    }
  });
}

function initSertifikat() {
  const grid = document.querySelector("#sertifikat .grid");
  const items = grid ? grid.children : [];
  const btnContainer = document.getElementById("sertifikat-btn-container");
  const btn = document.getElementById("show-more-sertifikat");
  const itemsToShow = 4;

  if (items.length > itemsToShow) {
    for (let i = itemsToShow; i < items.length; i++) {
      items[i].classList.add("hidden");
    }
    if (btn) {
      btn.addEventListener("click", () => {
        for (let i = itemsToShow; i < items.length; i++) {
          items[i].classList.remove("hidden");
        }
        btnContainer.classList.add("hidden");
      });
    }
  } else if (btnContainer) {
    btnContainer.classList.add("hidden");
  }
}

function initContact() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      if (!name || !message) {
        alert("Harap isi Nama dan Pesan.");
        return;
      }

      const whatsappMessage = `*Pesan Baru dari Portfolio Website*:%0A%0A` +
        `*Nama:* ${name}%0A` +
        `*Email:* ${email}%0A` +
        `*Subject:* ${subject}%0A` +
        `*Pesan:*%0A${message}`;

      const phoneNumber = "6285890558653";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
      window.open(whatsappUrl, "_blank");
    });
  }
}

const promises = sectionMappings
  .filter(s => document.getElementById(s.id))
  .map(s => loadSection(s.id, s.file).then(() => s.callback && s.callback()));

Promise.all(promises).then(() => {
  if (typeof AOS !== 'undefined') {
    setTimeout(() => {
      AOS.init({ once: true, duration: 800, offset: 50 });
      AOS.refresh();
    }, 100);
  }
});

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset * 0.3;
  document.documentElement.style.setProperty("--scroll", scrolled + "px");
});
