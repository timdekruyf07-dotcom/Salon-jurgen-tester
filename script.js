/* ==========================================
   SALON JURGEN
   WEBSITE JAVASCRIPT

   MEERDERE PAGINA'S
   SVELTIA CMS
   LOGO: salon-jurgen-logo.png
========================================== */

(function () {
  "use strict";


  /* ========================================
     INSTELLINGEN
  ======================================== */

  const page = document.body.dataset.page || "home";

  const LOGO_URL = "images/salon-jurgen-logo.png";

  const DATA = {
    home: "content/home.json",
    behandelingen: "content/behandelingen.json",
    overOns: "content/over-ons.json",
    openingstijden: "content/openingstijden.json",
    contact: "content/contact.json"
  };


  /* ========================================
     HULPFUNCTIES
  ======================================== */

  function byId(id) {
    return document.getElementById(id);
  }


  function setText(id, value) {
    const element = byId(id);

    if (element && typeof value === "string") {
      element.textContent = value;
    }
  }


  function makeElement(tag, className, text) {
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
     VEILIGE LINKS
  ======================================== */

  function safeWebUrl(value) {
    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      return "";
    }

    try {
      const url = new URL(value.trim());

      return url.protocol === "https:"
        ? url.href
        : "";

    } catch (error) {
      return "";
    }
  }


  function safePhoneUrl(value) {
    if (typeof value !== "string") {
      return "";
    }

    const cleaned = value.replace(/[^\d+]/g, "");

    return /^\+?\d{6,15}$/.test(cleaned)
      ? "tel:" + cleaned
      : "";
  }


  function safeEmailUrl(value) {
    if (
      typeof value !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ) {
      return "";
    }

    return "mailto:" + value.trim();
  }


  /* ========================================
     AFBEELDINGEN
  ======================================== */

  function imageUrl(value) {
    if (
      typeof value !== "string" ||
      !value.trim()
    ) {
      return "";
    }

    let path = value.trim();

    if (/^https:\/\//i.test(path)) {
      return path;
    }

    if (
      /^[a-z][a-z0-9+.-]*:/i.test(path) ||
      path.startsWith("//")
    ) {
      return "";
    }

    const base = new URL(".", document.baseURI);

    const folder = base.pathname.replace(/\/$/, "");

    if (
      folder &&
      path.startsWith(folder + "/")
    ) {
      path = path.slice(folder.length);
    }

    path = path.replace(/^\/+/, "");

    if (path.split("/").includes("..")) {
      return "";
    }

    return new URL(path, base).href;
  }


  /* ========================================
     STYLING VOOR HET LOGO
  ======================================== */

  function addLogoStyles() {
    if (
      document.getElementById(
        "salon-jurgen-logo-styles"
      )
    ) {
      return;
    }

    const style = document.createElement("style");

    style.id = "salon-jurgen-logo-styles";

    style.textContent = `

      /* =====================================
         LOGO IN DE HEADER
      ===================================== */

      .site-header .brand {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;

        width: 218px;
        max-width: 100%;

        flex-shrink: 0;

        text-decoration: none;

        transition:
          opacity 0.25s ease,
          transform 0.25s ease;
      }

      .site-header .brand:hover {
        opacity: 0.85;
        transform: translateY(-1px);
      }

      .site-header .brand:focus-visible {
        outline: 2px solid var(--copper-light);
        outline-offset: 5px;
      }

      .site-header .brand-logo {
        display: block;

        width: 100%;
        height: 70px;

        object-fit: contain;
        object-position: left center;
      }


      /* =====================================
         RESERVETEKST BIJ ONTBREKEND LOGO
      ===================================== */

      .site-header .brand-fallback {
        display: none;

        color: #ffffff;

        font-family: var(--heading);
        font-size: 18px;
        font-weight: 800;
        letter-spacing: 0.08em;
      }

      .site-header .brand.logo-error .brand-logo {
        display: none;
      }

      .site-header .brand.logo-error .brand-fallback {
        display: block;
      }


      /* =====================================
         HEADER
      ===================================== */

      .site-header .nav-inner {
        min-height: 94px;
      }


      /* =====================================
         TABLET
      ===================================== */

      @media (max-width: 900px) {

        .site-header .brand {
          width: 176px;
        }

        .site-header .brand-logo {
          height: 62px;
        }

        .site-header .nav-inner {
          min-height: 78px;
        }

      }


      /* =====================================
         MOBIEL
      ===================================== */

      @media (max-width: 420px) {

        .site-header .brand {
          width: 155px;
        }

        .site-header .brand-logo {
          height: 56px;
        }

        .site-header .nav-inner {
          min-height: 72px;
        }

      }

    `;

    document.head.appendChild(style);
  }


  /* ========================================
     GEDEELDE HEADER

     ZICHTBAAR OP ALLE VIJF PAGINA'S
  ======================================== */

  function renderHeader() {
    const container = byId("site-header");

    if (!container) {
      return;
    }


    /* =====================================
       NAVIGATIELINKS
    ===================================== */

    const links = [
      {
        label: "Home",
        href: "index.html",
        key: "home"
      },
      {
        label: "Behandelingen",
        href: "behandelingen.html",
        key: "behandelingen"
      },
      {
        label: "Over de salon",
        href: "over-ons.html",
        key: "over-ons"
      },
      {
        label: "Openingstijden",
        href: "openingstijden.html",
        key: "openingstijden"
      },
      {
        label: "Contact",
        href: "contact.html",
        key: "contact"
      }
    ];


    /* =====================================
       DEMOBALK
    ===================================== */

    const demo = makeElement(
      "div",
      "demo-bar",
      "Onofficieel websiteconcept · Ontwerpvoorstel voor Salon Jurgen"
    );


    /* =====================================
       HEADER
    ===================================== */

    const header = makeElement(
      "header",
      "site-header"
    );

    const inner = makeElement(
      "div",
      "container nav-inner"
    );


    /* =====================================
       LOGO ALS HOME-KNOP
    ===================================== */

    const brand = makeElement(
      "a",
      "brand"
    );

    brand.href = "index.html";

    brand.setAttribute(
      "aria-label",
      "Salon Jurgen - Ga naar de homepage"
    );

    brand.setAttribute(
      "title",
      "Terug naar de homepage"
    );


    /* =====================================
       LOGO-AFBEELDING
    ===================================== */

    const logo = document.createElement("img");

    logo.className = "brand-logo";

    logo.src = LOGO_URL;

    logo.alt = "Salon Jurgen";

    logo.width = 218;

    logo.height = 123;

    logo.decoding = "async";


    /* =====================================
       RESERVETEKST
    ===================================== */

    const fallback = makeElement(
      "span",
      "brand-fallback",
      "SALON JURGEN"
    );


    logo.addEventListener("error", function () {
      brand.classList.add("logo-error");
    });


    brand.append(
      logo,
      fallback
    );


    /* =====================================
       MOBIELE MENUKNOP
    ===================================== */

    const toggle = makeElement(
      "button",
      "menu-toggle"
    );

    toggle.type = "button";

    toggle.setAttribute(
      "aria-label",
      "Open navigatiemenu"
    );

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    toggle.setAttribute(
      "aria-controls",
      "main-navigation"
    );

    for (let i = 0; i < 3; i++) {
      toggle.appendChild(
        document.createElement("span")
      );
    }


    /* =====================================
       NAVIGATIE
    ===================================== */

    const nav = makeElement(
      "nav",
      "navigation"
    );

    nav.id = "main-navigation";

    nav.setAttribute(
      "aria-label",
      "Hoofdnavigatie"
    );


    links.forEach(function (item) {
      const link = makeElement(
        "a",
        "",
        item.label
      );

      link.href = item.href;

      if (item.key === page) {
        link.classList.add("active");

        link.setAttribute(
          "aria-current",
          "page"
        );
      }

      nav.appendChild(link);
    });


    /* =====================================
       AFSPRAAKKNOP
    ===================================== */

    const booking = makeElement(
      "a",
      "nav-booking booking-link"
    );

    booking.href = "contact.html";

    booking.appendChild(
      document.createTextNode(
        "Maak een afspraak "
      )
    );

    booking.appendChild(
      makeElement(
        "span",
        "",
        "↗"
      )
    );

    nav.appendChild(booking);


    /* =====================================
       HEADER SAMENVOEGEN
    ===================================== */

    inner.append(
      brand,
      toggle,
      nav
    );

    header.appendChild(inner);

    container.replaceChildren(
      demo,
      header
    );


    /* =====================================
       MOBIEL MENU
    ===================================== */

    function closeMenu() {
      nav.classList.remove("open");

      document.body.classList.remove(
        "menu-open"
      );

      toggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }


    toggle.addEventListener(
      "click",
      function () {
        const opened = nav.classList.toggle(
          "open"
        );

        document.body.classList.toggle(
          "menu-open",
          opened
        );

        toggle.setAttribute(
          "aria-expanded",
          String(opened)
        );
      }
    );


    nav.querySelectorAll("a").forEach(
      function (link) {
        link.addEventListener(
          "click",
          closeMenu
        );
      }
    );


    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key === "Escape") {
          closeMenu();
        }
      }
    );
  }


  /* ========================================
     GEDEELDE FOOTER
  ======================================== */

  function renderFooter() {
    const container = byId("site-footer");

    if (!container) {
      return;
    }

    const footer = makeElement(
      "footer",
      "site-footer"
    );

    const inner = makeElement(
      "div",
      "container"
    );


    /* =====================================
       BOVENKANT FOOTER
    ===================================== */

    const top = makeElement(
      "div",
      "footer-top"
    );

    const brand = makeElement(
      "a",
      "footer-brand",
      "SALON JURGEN"
    );

    brand.href = "index.html";

    brand.appendChild(
      makeElement(
        "span",
        "",
        "."
      )
    );


    const back = makeElement(
      "a",
      "back-top",
      "Terug naar boven ↑"
    );

    back.href = "#main";

    top.append(
      brand,
      back
    );


    /* =====================================
       ONDERKANT FOOTER
    ===================================== */

    const bottom = makeElement(
      "div",
      "footer-bottom"
    );

    bottom.appendChild(
      makeElement(
        "p",
        "",
        "© " +
        new Date().getFullYear() +
        " Salon Jurgen · Onofficieel ontwerpconcept"
      )
    );

    bottom.appendChild(
      makeElement(
        "p",
        "",
        "Websitevoorstel — geen officiële website van de salon."
      )
    );


    inner.append(
      top,
      bottom
    );

    footer.appendChild(inner);

    container.replaceChildren(footer);
  }


  /* ========================================
     ANIMATIES
  ======================================== */

  function initializeAnimations() {
    const elements = document.querySelectorAll(
      ".reveal"
    );

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
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
            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );
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
     JSON LADEN UIT SVELTIA CMS
  ======================================== */

  async function loadJson(url) {
    const response = await fetch(url, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        url + ": " + response.status
      );
    }

    return response.json();
  }


  /* ========================================
     BEHANDELINGEN
  ======================================== */

  function renderServices(
    services,
    containerId,
    limit
  ) {
    const grid = byId(containerId);

    if (
      !grid ||
      !Array.isArray(services)
    ) {
      return;
    }


    const fragment = document.createDocumentFragment();


    const visibleServices = services.filter(
      function (service) {
        return (
          service &&
          typeof service === "object" &&
          service.published !== false
        );
      }
    );


    const selected = typeof limit === "number"
      ? visibleServices.slice(0, limit)
      : visibleServices;


    selected.forEach(
      function (service, index) {
        const card = makeElement(
          "article",
          "service-card"
        );


        /* =================================
           BOVENKANT KAART
        ================================= */

        const top = makeElement(
          "div",
          "service-card-top"
        );

        top.appendChild(
          makeElement(
            "span",
            "",
            String(index + 1).padStart(
              2,
              "0"
            )
          )
        );

        top.appendChild(
          makeElement(
            "span",
            "service-arrow",
            "↗"
          )
        );


        /* =================================
           INHOUD KAART
        ================================= */

        const body = document.createElement(
          "div"
        );

        body.appendChild(
          makeElement(
            "h3",
            "",
            service.name || "Behandeling"
          )
        );

        body.appendChild(
          makeElement(
            "p",
            "",
            service.description || ""
          )
        );


        /* =================================
           ONDERKANT KAART
        ================================= */

        const bottom = makeElement(
          "div",
          "service-card-bottom"
        );

        bottom.appendChild(
          makeElement(
            "span",
            "",
            service.price || "Prijs op aanvraag"
          )
        );

        bottom.appendChild(
          makeElement(
            "span",
            "",
            service.duration || "BEHANDELING"
          )
        );


        card.append(
          top,
          body,
          bottom
        );

        fragment.appendChild(card);
      }
    );


    if (!selected.length) {
      fragment.appendChild(
        makeElement(
          "p",
          "services-empty",
          "Er zijn momenteel geen behandelingen vermeld."
        )
      );
    }


    grid.replaceChildren(fragment);
  }


  /* ========================================
     OPENINGSTIJDEN
  ======================================== */

  function renderOpeningHours(hours) {
    const list = byId("hours-list");

    if (
      !list ||
      !Array.isArray(hours)
    ) {
      return;
    }


    const fragment = document.createDocumentFragment();


    hours.forEach(function (item) {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return;
      }

      if (!item.day && !item.hours) {
        return;
      }


      const row = makeElement(
        "div",
        "hours-row"
      );

      row.appendChild(
        makeElement(
          "strong",
          "",
          item.day || ""
        )
      );

      row.appendChild(
        makeElement(
          "span",
          "",
          item.hours || ""
        )
      );

      fragment.appendChild(row);
    });


    if (!fragment.childNodes.length) {
      fragment.appendChild(
        makeElement(
          "p",
          "hours-placeholder",
          "Openingstijden worden binnenkort toegevoegd."
        )
      );
    }


    list.replaceChildren(fragment);
  }


  /* ========================================
     REVIEWS
  ======================================== */

  function renderReviews(reviews) {
    const grid = byId("reviews-grid");

    if (
      !grid ||
      !Array.isArray(reviews)
    ) {
      return;
    }


    const fragment = document.createDocumentFragment();


    const visible = reviews.filter(
      function (review) {
        return (
          review &&
          typeof review === "object" &&
          review.published !== false &&
          typeof review.text === "string" &&
          review.text.trim()
        );
      }
    );


    visible.forEach(function (review) {
      const card = makeElement(
        "article",
        "review-page-card"
      );


      /* =================================
         AANHALINGSTEKEN
      ================================= */

      card.appendChild(
        makeElement(
          "span",
          "review-page-quote",
          "”"
        )
      );


      /* =================================
         REVIEWTEKST
      ================================= */

      card.appendChild(
        makeElement(
          "p",
          "",
          review.text
        )
      );


      /* =================================
         NAAM KLANT
      ================================= */

      const author = makeElement(
        "div",
        "review-page-author",
        review.name || "Klant"
      );

      card.appendChild(author);

      fragment.appendChild(card);
    });


    /* =====================================
       GEEN REVIEWS
    ===================================== */

    if (!visible.length) {
      const empty = makeElement(
        "div",
        "reviews-empty"
      );

      empty.appendChild(
        makeElement(
          "span",
          "",
          "”"
        )
      );

      empty.appendChild(
        makeElement(
          "h3",
          "",
          "Klantbeoordelingen"
        )
      );

      empty.appendChild(
        makeElement(
          "p",
          "",
          "Hier verschijnen echte klantreviews zodra deze zijn toegevoegd."
        )
      );

      fragment.appendChild(empty);
    }


    grid.replaceChildren(fragment);
  }


  /* ========================================
     FOTO'S LADEN
  ======================================== */

  function loadOptionalImage(
    imageId,
    placeholderId,
    path,
    alt
  ) {
    const image = byId(imageId);
    const placeholder = byId(placeholderId);

    if (
      !image ||
      !placeholder
    ) {
      return;
    }


    const url = imageUrl(path);


    if (!url) {
      image.hidden = true;
      placeholder.hidden = false;
      return;
    }


    image.alt = alt || "Foto van Salon Jurgen";


    image.onload = function () {
      image.hidden = false;
      placeholder.hidden = true;
    };


    image.onerror = function () {
      image.hidden = true;
      placeholder.hidden = false;
    };


    image.src = url;
  }


  /* ========================================
     CONTACTGEGEVENS
  ======================================== */

  function renderContact(data) {
    if (
      !data ||
      typeof data !== "object"
    ) {
      return;
    }


    setText(
      "contact-page-introduction",
      data.introduction
    );

    setText(
      "contact-extra-information",
      data.extra_information
    );


    /* =====================================
       ADRES
    ===================================== */

    const address = byId("contact-address");

    if (address) {
      const location = [
        data.postal_code || "",
        data.city || ""
      ]
        .filter(Boolean)
        .join(" ");


      address.textContent = [
        data.address || "",
        location
      ]
        .filter(Boolean)
        .join("\n");
    }


    /* =====================================
       TELEFOON
    ===================================== */

    const phone = byId("contact-phone");

    if (phone) {
      const url = safePhoneUrl(
        data.phone
      );

      if (url) {
        phone.href = url;
        phone.textContent = data.phone;
      } else {
        phone.removeAttribute("href");

        phone.textContent =
          "Nog niet beschikbaar";
      }
    }


    /* =====================================
       E-MAIL
    ===================================== */

    const email = byId("contact-email");

    if (email) {
      const url = safeEmailUrl(
        data.email
      );

      if (url) {
        email.href = url;
        email.textContent = data.email;
      } else {
        email.removeAttribute("href");

        email.textContent =
          "Nog niet beschikbaar";
      }
    }


    /* =====================================
       GOOGLE MAPS
    ===================================== */

    const maps = byId("contact-maps");

    if (maps) {
      const url = safeWebUrl(
        data.maps
      );

      if (url) {
        maps.href = url;
        maps.hidden = false;
      } else {
        maps.removeAttribute("href");
        maps.hidden = true;
      }
    }


    /* =====================================
       BELKNOP
    ===================================== */

    const phoneButton = byId(
      "contact-phone-button"
    );

    if (phoneButton) {
      const url = safePhoneUrl(
        data.phone
      );

      if (url) {
        phoneButton.href = url;
        phoneButton.hidden = false;
      } else {
        phoneButton.hidden = true;
      }
    }


    /* =====================================
       AFSPRAAKKNOPPEN

       Haalt de boekingslink op uit
       content/contact.json.
    ===================================== */

    const bookingUrl = safeWebUrl(
      data.booking_url
    );


    document
      .querySelectorAll(".booking-link")
      .forEach(function (link) {
        if (bookingUrl) {
          link.href = bookingUrl;

          link.target = "_blank";

          link.rel =
            "noopener noreferrer";
        } else {
          link.href = page === "contact"
            ? "#contactgegevens"
            : "contact.html";

          link.removeAttribute(
            "target"
          );

          link.removeAttribute(
            "rel"
          );
        }
      });
  }


  /* ========================================
     HOMEPAGE
  ======================================== */

  async function loadHome() {
    const results = await Promise.allSettled([
      loadJson(DATA.home),
      loadJson(DATA.behandelingen),
      loadJson(DATA.overOns)
    ]);


    /* =====================================
       HERO
    ===================================== */

    if (
      results[0].status === "fulfilled"
    ) {
      const home = results[0].value;

      if (home.hero) {
        setText(
          "hero-eyebrow",
          home.hero.eyebrow
        );

        setText(
          "hero-title-line1",
          home.hero.title_line1
        );

        setText(
          "hero-title-line2",
          home.hero.title_line2
        );

        setText(
          "hero-description",
          home.hero.description
        );


        loadOptionalImage(
          "hero-image",
          "hero-art-placeholder",
          home.hero.image,
          home.hero.image_alt
        );
      }
    }


    /* =====================================
       BEHANDELINGEN OP HOMEPAGE
    ===================================== */

    if (
      results[1].status === "fulfilled"
    ) {
      renderServices(
        results[1].value.services,
        "home-services-grid",
        2
      );
    }


    /* =====================================
       OVER DE SALON PREVIEW
    ===================================== */

    if (
      results[2].status === "fulfilled"
    ) {
      setText(
        "home-about-description",
        results[2].value.description
      );
    }
  }


  /* ========================================
     PAGINA BEHANDELINGEN
  ======================================== */

  async function loadTreatments() {
    const data = await loadJson(
      DATA.behandelingen
    );


    setText(
      "treatments-introduction",
      data.introduction
    );


    renderServices(
      data.services,
      "treatments-grid"
    );
  }


  /* ========================================
     PAGINA OVER DE SALON
  ======================================== */

  async function loadAbout() {
    const data = await loadJson(
      DATA.overOns
    );


    setText(
      "about-page-introduction",
      data.introduction
    );

    setText(
      "about-page-title",
      data.title
    );

    setText(
      "about-page-description",
      data.description
    );

    setText(
      "reviews-introduction",
      data.reviews_introduction
    );


    /* =====================================
       FOTO VAN DE SALON
    ===================================== */

    loadOptionalImage(
      "about-photo",
      "about-photo-placeholder",
      data.image,
      data.image_alt
    );


    /* =====================================
       REVIEWS
    ===================================== */

    renderReviews(data.reviews);
  }


  /* ========================================
     PAGINA OPENINGSTIJDEN
  ======================================== */

  async function loadHours() {
    const data = await loadJson(
      DATA.openingstijden
    );


    setText(
      "hours-page-introduction",
      data.introduction
    );

    setText(
      "hours-note",
      data.note
    );

    setText(
      "hours-extra-information",
      data.extra_information
    );


    renderOpeningHours(
      data.opening_hours
    );
  }


  /* ========================================
     PAGINA CONTACT
  ======================================== */

  async function loadContact() {
    const data = await loadJson(
      DATA.contact
    );

    renderContact(data);
  }


  /* ========================================
     BOEKINGSLINK OP ALLE PAGINA'S
  ======================================== */

  async function loadBookingLink() {
    const data = await loadJson(
      DATA.contact
    );

    renderContact(data);
  }


  /* ========================================
     WEBSITE STARTEN
  ======================================== */

  async function start() {

    /* LOGOSTYLING */

    addLogoStyles();


    /* HEADER MET PNG-LOGO */

    renderHeader();


    /* FOOTER */

    renderFooter();


    /* ANIMATIES */

    initializeAnimations();


    /* =====================================
       PAGINAGEGEVENS LADEN
    ===================================== */

    const tasks = [];


    switch (page) {

      case "home":
        tasks.push(
          loadHome()
        );
        break;


      case "behandelingen":
        tasks.push(
          loadTreatments()
        );
        break;


      case "over-ons":
        tasks.push(
          loadAbout()
        );
        break;


      case "openingstijden":
        tasks.push(
          loadHours()
        );
        break;


      case "contact":
        tasks.push(
          loadContact()
        );
        break;

    }


    /* =====================================
       BOEKINGSLINK OPHALEN
    ===================================== */

    if (page !== "contact") {
      tasks.push(
        loadBookingLink()
      );
    }


    /* =====================================
       FOUTEN AFHANDELEN
    ===================================== */

    const results = await Promise.allSettled(
      tasks
    );


    results.forEach(function (result) {
      if (
        result.status === "rejected"
      ) {
        console.error(
          "Salon Jurgen - gegevens laden:",
          result.reason
        );
      }
    });
  }


  /* ========================================
     START
  ======================================== */

  start();

})();
