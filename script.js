/* ==========================================
   SALON JURGEN
   WEBSITE JAVASCRIPT
========================================== */

(function () {
  "use strict";

  const DATA_URL = "content/home.json";


  /* ========================================
     HULPFUNCTIES
  ======================================== */

  function getElement(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const element = getElement(id);

    if (element && typeof value === "string") {
      element.textContent = value;
    }
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      element.textContent = String(text);
    }

    return element;
  }


  /* ========================================
     VEILIGE URL'S
  ======================================== */

  function getSafeUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
      return "";
    }

    try {
      const url = new URL(value.trim());

      if (url.protocol === "https:") {
        return url.href;
      }
    } catch (error) {
      return "";
    }

    return "";
  }

  function getImageUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
      return "";
    }

    let path = value.trim();

    if (/^https:\/\//i.test(path)) {
      return path;
    }

    if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("//")) {
      return "";
    }

    const siteBase = new URL(".", document.baseURI);
    const siteFolder = siteBase.pathname.replace(/\/$/, "");

    if (siteFolder && path.startsWith(siteFolder + "/")) {
      path = path.slice(siteFolder.length);
    }

    path = path.replace(/^\/+/, "");

    if (path.split("/").includes("..")) {
      return "";
    }

    return new URL(path, siteBase).href;
  }

  function getPhoneUrl(value) {
    if (typeof value !== "string") {
      return "";
    }

    const cleaned = value.replace(/[^\d+]/g, "");

    return /^\+?\d{6,15}$/.test(cleaned)
      ? "tel:" + cleaned
      : "";
  }

  function getEmailUrl(value) {
    if (
      typeof value !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ) {
      return "";
    }

    return "mailto:" + value.trim();
  }


  /* ========================================
     MOBIEL MENU
  ======================================== */

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = getElement("main-navigation");

  if (menuButton && navigation) {
    function closeMenu() {
      navigation.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }

    menuButton.addEventListener("click", function () {
      const isOpen = navigation.classList.toggle("open");

      document.body.classList.toggle("menu-open", isOpen);

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }


  /* ========================================
     ANIMATIES
  ======================================== */

  function initializeAnimations() {
    const elements = document.querySelectorAll(".reveal");

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach(function (element) {
        element.classList.add("visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 30px 0px"
      }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }


  /* ========================================
     HERO
  ======================================== */

  function renderHero(hero) {
    if (!hero || typeof hero !== "object") {
      return;
    }

    setText("hero-eyebrow", hero.eyebrow);
    setText("hero-title-line1", hero.title_line1);
    setText("hero-title-line2", hero.title_line2);
    setText("hero-description", hero.description);

    const image = getElement("hero-image");
    const placeholder = getElement("hero-art-placeholder");

    if (!image || !placeholder) {
      return;
    }

    const imageUrl = getImageUrl(hero.image);

    if (!imageUrl) {
      image.hidden = true;
      placeholder.hidden = false;
      return;
    }

    image.alt = hero.image_alt || "Foto van Salon Jurgen";

    image.onload = function () {
      image.hidden = false;
      placeholder.hidden = true;
    };

    image.onerror = function () {
      image.hidden = true;
      placeholder.hidden = false;
    };

    image.src = imageUrl;
  }


  /* ========================================
     BEHANDELINGEN
  ======================================== */

  function renderServices(services) {
    if (!Array.isArray(services)) {
      return;
    }

    const grid = getElement("services-grid");

    if (!grid) {
      return;
    }

    const fragment = document.createDocumentFragment();

    services.forEach(function (service, index) {
      if (!service || typeof service !== "object") {
        return;
      }

      const card = createElement("article", "service-card");

      const top = createElement("div", "service-card-top");

      top.appendChild(
        createElement(
          "span",
          "",
          String(index + 1).padStart(2, "0")
        )
      );

      top.appendChild(
        createElement("span", "service-arrow", "↗")
      );

      card.appendChild(top);


      const content = document.createElement("div");

      content.appendChild(
        createElement("h3", "", service.name || "Behandeling")
      );

      content.appendChild(
        createElement("p", "", service.description || "")
      );

      card.appendChild(content);


      const bottom = createElement("div", "service-card-bottom");

      bottom.appendChild(
        createElement(
          "span",
          "",
          service.price || "Prijs op aanvraag"
        )
      );

      bottom.appendChild(
        createElement(
          "span",
          "",
          service.duration || "BEHANDELING"
        )
      );

      card.appendChild(bottom);

      fragment.appendChild(card);
    });

    if (fragment.childNodes.length) {
      grid.replaceChildren(fragment);
    } else {
      grid.replaceChildren(
        createElement(
          "p",
          "",
          "Er zijn momenteel geen behandelingen vermeld."
        )
      );
    }
  }


  /* ========================================
     OVER DE SALON
  ======================================== */

  function renderAbout(about) {
    if (!about || typeof about !== "object") {
      return;
    }

    setText("about-title", about.title);
    setText("about-description", about.description);
  }


  /* ========================================
     OPENINGSTIJDEN
  ======================================== */

  function renderHours(hours) {
    if (!Array.isArray(hours)) {
      return;
    }

    const list = getElement("hours-list");

    if (!list) {
      return;
    }

    const fragment = document.createDocumentFragment();

    hours.forEach(function (item) {
      if (!item || typeof item !== "object") {
        return;
      }

      const row = createElement("div", "hours-row");

      row.appendChild(
        createElement("strong", "", item.day || "")
      );

      row.appendChild(
        createElement("span", "", item.hours || "")
      );

      fragment.appendChild(row);
    });

    if (!fragment.childNodes.length) {
      fragment.appendChild(
        createElement(
          "p",
          "hours-placeholder",
          "Openingstijden worden binnenkort toegevoegd."
        )
      );
    }

    list.replaceChildren(fragment);
  }


  /* ========================================
     CONTACTGEGEVENS
  ======================================== */

  function renderContact(contact) {
    if (!contact || typeof contact !== "object") {
      return;
    }

    setText("contact-introduction", contact.introduction);

    const address = getElement("contact-address");

    if (address) {
      const street = contact.address || "";
      const postal = contact.postal_code || "";
      const city = contact.city || "";

      const location = [postal, city]
        .filter(Boolean)
        .join(" ");

      address.textContent = [street, location]
        .filter(Boolean)
        .join("\n");

      address.style.whiteSpace = "pre-line";
    }


    /* TELEFOON */

    const phone = getElement("contact-phone");
    const phoneButton = getElement("contact-phone-button");

    if (phone && phoneButton) {
      const phoneUrl = getPhoneUrl(contact.phone);

      if (phoneUrl) {
        phone.href = phoneUrl;
        phone.textContent = contact.phone;
        phone.hidden = false;

        phoneButton.href = phoneUrl;
        phoneButton.hidden = false;
      } else {
        phone.removeAttribute("href");
        phone.textContent = "Nog niet ingevuld";
        phoneButton.hidden = true;
      }
    }


    /* E-MAIL */

    const email = getElement("contact-email");

    if (email) {
      const emailUrl = getEmailUrl(contact.email);

      if (emailUrl) {
        email.href = emailUrl;
        email.textContent = contact.email;
        email.hidden = false;
      } else {
        email.removeAttribute("href");
        email.textContent = "Nog niet ingevuld";
      }
    }


    /* GOOGLE MAPS */

    const maps = getElement("contact-maps");

    if (maps) {
      const mapsUrl = getSafeUrl(contact.maps);

      if (mapsUrl) {
        maps.href = mapsUrl;
        maps.hidden = false;
      } else {
        maps.hidden = true;
        maps.removeAttribute("href");
      }
    }


    /* ONLINE BOEKEN */

    const bookingUrl = getSafeUrl(contact.booking_url);

    const heroBooking = getElement("hero-booking-button");
    const navBooking = getElement("nav-booking-button");
    const contactBooking = getElement("contact-booking-button");

    [heroBooking, navBooking, contactBooking].forEach(
      function (button) {
        if (!button) {
          return;
        }

        if (bookingUrl) {
          button.href = bookingUrl;
          button.target = "_blank";
          button.rel = "noopener noreferrer";
        } else {
          button.href = "#contact";
          button.removeAttribute("target");
          button.removeAttribute("rel");
        }
      }
    );

    if (contactBooking) {
      contactBooking.hidden = !bookingUrl;
    }
  }


  /* ========================================
     ALLE CMS-GEGEVENS TONEN
  ======================================== */

  function renderPage(data) {
    if (!data || typeof data !== "object") {
      return;
    }

    renderHero(data.hero);

    setText(
      "services-introduction",
      data.services_introduction
    );

    renderServices(data.services);

    renderAbout(data.about);

    setText(
      "hours-introduction",
      data.hours_introduction
    );

    setText("hours-note", data.hours_note);

    renderHours(data.opening_hours);

    renderContact(data.contact);
  }


  /* ========================================
     JSON-BESTAND LADEN
  ======================================== */

  async function loadContent() {
    try {
      const response = await fetch(DATA_URL, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(
          "Kon CMS-gegevens niet laden: " + response.status
        );
      }

      const data = await response.json();

      renderPage(data);

    } catch (error) {
      console.error("Salon Jurgen CMS:", error);

      // De voorbeeldinhoud in index.html
      // blijft zichtbaar als het laden mislukt.
    }
  }


  /* ========================================
     STARTEN
  ======================================== */

  const year = getElement("current-year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  initializeAnimations();
  loadContent();

})();
