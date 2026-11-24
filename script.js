/* ==========================================
   SALON JURGEN
   WEBSITE JAVASCRIPT

   - VIJF PAGINA'S
   - SVELTIA CMS
   - PNG-LOGO
   - REVIEWS MET STERREN
   - REVIEWS SORTEREN
========================================== */

(function () {
  "use strict";

  const page = document.body.dataset.page || "home";

  const LOGO_URL = "images/salon-jurgen-logo.png";

  const DATA = {
    home: "content/home.json",
    behandelingen: "content/behandelingen.json",
    overOns: "content/over-ons.json",
    openingstijden: "content/openingstijden.json",
    contact: "content/contact.json"
  };

  let allReviews = [];


  /* ========================================
     BASISFUNCTIES
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
     LINKS CONTROLEREN
  ======================================== */

  function safeWebUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
      return "";
    }

    try {
      const url = new URL(value.trim());

      return url.protocol === "https:" ? url.href : "";
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
    if (typeof value !== "string" || !value.trim()) {
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

    if (folder && path.startsWith(folder + "/")) {
      path = path.slice(folder.length);
    }

    path = path.replace(/^\/+/, "");

    if (path.split("/").includes("..")) {
      return "";
    }

    return new URL(path, base).href;
  }


  /* ========================================
     EXTRA STYLING

     Deze styling wordt automatisch geladen.
     style.css en pages.css blijven hetzelfde.
  ======================================== */

  function addExtraStyles() {
    if (byId("salon-jurgen-extra-styles")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "salon-jurgen-extra-styles";

    style.textContent = `

      /* =====================================
         LOGO
      ===================================== */

      .site-header .brand {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        width: 218px;
        max-width: 100%;
        flex-shrink: 0;
        text-decoration: none;
        transition: opacity .25s, transform .25s;
      }

      .site-header .brand:hover {
        opacity: .85;
        transform: translateY(-1px);
      }

      .site-header .brand-logo {
        display: block;
        width: 100%;
        height: 70px;
        object-fit: contain;
        object-position: left center;
      }

      .site-header .brand-fallback {
        display: none;
        color: #fff;
        font-family: var(--heading);
        font-size: 18px;
        font-weight: 800;
        letter-spacing: .08em;
      }

      .site-header .brand.logo-error .brand-logo {
        display: none;
      }

      .site-header .brand.logo-error .brand-fallback {
        display: block;
      }

      .site-header .nav-inner {
        min-height: 94px;
      }


      /* =====================================
         REVIEWS: SORTEERBALK
      ===================================== */

      .reviews-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 22px;
        margin-bottom: 30px;
        padding: 24px 28px;
        background: #fffcf7;
        border: 1px solid var(--line);
      }

      .reviews-count {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .reviews-count strong {
        color: var(--dark);
        font-family: var(--heading);
        font-size: 20px;
        font-weight: 800;
      }

      .reviews-count span {
        color: var(--muted);
        font-size: 12px;
      }

      .reviews-sort-control {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 14px;
      }

      .reviews-sort-control label {
        color: var(--dark);
        font-size: 13px;
        font-weight: 700;
      }

      .reviews-sort-control select {
        min-width: 220px;
        min-height: 46px;
        padding: 0 35px 0 14px;
        border: 1px solid var(--line);
        background: #fff;
        color: var(--dark);
        font-family: var(--font);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      .reviews-sort-control select:focus-visible {
        outline: 2px solid var(--copper);
        outline-offset: 3px;
      }


      /* =====================================
         REVIEWS: KAARTEN
      ===================================== */

      .review-page-card {
        gap: 16px;
      }

      .review-stars {
        display: flex;
        align-items: center;
        gap: 3px;
        min-height: 26px;
      }

      .review-star {
        color: #d9d2c9;
        font-size: 23px;
        line-height: 1;
      }

      .review-star.filled {
        color: #bf8b62;
      }

      .review-rating-label {
        margin-left: 8px;
        color: #66584d;
        font-size: 12px;
        font-weight: 700;
      }

      .review-rating-unknown {
        color: var(--muted);
        font-size: 12px;
      }

      .review-page-card .review-page-quote {
        margin-bottom: 0;
        line-height: .7;
      }

      .review-page-card p {
        flex-grow: 1;
      }

      .review-page-footer {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 12px;
        margin-top: auto;
        padding-top: 20px;
        border-top: 1px solid var(--line);
      }

      .review-page-footer .review-page-author {
        margin: 0;
        padding: 0;
      }

      .review-date {
        color: var(--muted);
        font-size: 12px;
        text-align: right;
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

      @media (max-width: 600px) {
        .reviews-toolbar {
          align-items: stretch;
          flex-direction: column;
          padding: 22px;
        }

        .reviews-sort-control {
          align-items: stretch;
          flex-direction: column;
          gap: 8px;
        }

        .reviews-sort-control select {
          width: 100%;
        }
      }

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
     HEADER
  ======================================== */

  function renderHeader() {
    const container = byId("site-header");

    if (!container) {
      return;
    }

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

    const demo = makeElement(
      "div",
      "demo-bar",
      "Onofficieel websiteconcept · Ontwerpvoorstel voor Salon Jurgen"
    );

    const header = makeElement("header", "site-header");

    const inner = makeElement("div", "container nav-inner");


    /* LOGO ALS HOME-KNOP */

    const brand = makeElement("a", "brand");

    brand.href = "index.html";

    brand.setAttribute(
      "aria-label",
      "Salon Jurgen - Ga naar de homepage"
    );

    brand.title = "Terug naar de homepage";

    const logo = document.createElement("img");

    logo.className = "brand-logo";
    logo.src = LOGO_URL;
    logo.alt = "Salon Jurgen";
    logo.width = 218;
    logo.height = 123;
    logo.decoding = "async";

    const fallback = makeElement(
      "span",
      "brand-fallback",
      "SALON JURGEN"
    );

    logo.addEventListener("error", function () {
      brand.classList.add("logo-error");
    });

    brand.append(logo, fallback);


    /* MOBIEL MENU */

    const toggle = makeElement("button", "menu-toggle");

    toggle.type = "button";

    toggle.setAttribute(
      "aria-label",
      "Open navigatiemenu"
    );

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "main-navigation");

    for (let i = 0; i < 3; i++) {
      toggle.appendChild(document.createElement("span"));
    }


    /* NAVIGATIE */

    const nav = makeElement("nav", "navigation");

    nav.id = "main-navigation";

    nav.setAttribute("aria-label", "Hoofdnavigatie");

    links.forEach(function (item) {
      const link = makeElement("a", "", item.label);

      link.href = item.href;

      if (item.key === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }

      nav.appendChild(link);
    });

    const booking = makeElement(
      "a",
      "nav-booking booking-link"
    );

    booking.href = "contact.html";

    booking.appendChild(
      document.createTextNode("Maak een afspraak ")
    );

    booking.appendChild(makeElement("span", "", "↗"));

    nav.appendChild(booking);

    inner.append(brand, toggle, nav);

    header.appendChild(inner);

    container.replaceChildren(demo, header);


    /* MOBIEL MENU FUNCTIONALITEIT */

    function closeMenu() {
      nav.classList.remove("open");

      document.body.classList.remove("menu-open");

      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      const opened = nav.classList.toggle("open");

      document.body.classList.toggle("menu-open", opened);

      toggle.setAttribute("aria-expanded", String(opened));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }


  /* ========================================
     FOOTER
  ======================================== */

  function renderFooter() {
    const container = byId("site-footer");

    if (!container) {
      return;
    }

    const footer = makeElement("footer", "site-footer");

    const inner = makeElement("div", "container");

    const top = makeElement("div", "footer-top");

    const brand = makeElement(
      "a",
      "footer-brand",
      "SALON JURGEN"
    );

    brand.href = "index.html";

    brand.appendChild(makeElement("span", "", "."));

    const back = makeElement(
      "a",
      "back-top",
      "Terug naar boven ↑"
    );

    back.href = "#main";

    top.append(brand, back);

    const bottom = makeElement("div", "footer-bottom");

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

    inner.append(top, bottom);

    footer.appendChild(inner);

    container.replaceChildren(footer);
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
     JSON LADEN
  ======================================== */

  async function loadJson(url) {
    const response = await fetch(url, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(url + ": " + response.status);
    }

    return response.json();
  }


  /* ========================================
     BEHANDELINGEN
  ======================================== */

  function renderServices(services, containerId, limit) {
    const grid = byId(containerId);

    if (!grid || !Array.isArray(services)) {
      return;
    }

    const fragment = document.createDocumentFragment();

    const visibleServices = services.filter(function (service) {
      return (
        service &&
        typeof service === "object" &&
        service.published !== false
      );
    });

    const selected = typeof limit === "number"
      ? visibleServices.slice(0, limit)
      : visibleServices;

    selected.forEach(function (service, index) {
      const card = makeElement("article", "service-card");

      const top = makeElement("div", "service-card-top");

      top.appendChild(
        makeElement(
          "span",
          "",
          String(index + 1).padStart(2, "0")
        )
      );

      top.appendChild(
        makeElement("span", "service-arrow", "↗")
      );

      const body = document.createElement("div");

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

      card.append(top, body, bottom);

      fragment.appendChild(card);
    });

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

    if (!list || !Array.isArray(hours)) {
      return;
    }

    const fragment = document.createDocumentFragment();

    hours.forEach(function (item) {
      if (!item || typeof item !== "object") {
        return;
      }

      if (!item.day && !item.hours) {
        return;
      }

      const row = makeElement("div", "hours-row");

      row.appendChild(
        makeElement("strong", "", item.day || "")
      );

      row.appendChild(
        makeElement("span", "", item.hours || "")
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
     REVIEWS - HULPFUNCTIES
  ======================================== */

  function getRating(review) {
    if (
      review.rating === null ||
      review.rating === undefined ||
      review.rating === ""
    ) {
      return null;
    }

    const rating = Number(review.rating);

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return null;
    }

    return rating;
  }

  function getReviewDate(review) {
    if (typeof review.date !== "string") {
      return null;
    }

    const value = review.date.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }

    const date = new Date(value + "T12:00:00Z");

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    ) {
      return null;
    }

    return date;
  }

  function formatReviewDate(review) {
    const date = getReviewDate(review);

    if (!date) {
      return "";
    }

    return new Intl.DateTimeFormat("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);
  }


  /* ========================================
     REVIEWS - STERREN MAKEN
  ======================================== */

  function createStars(review) {
    const rating = getRating(review);

    const container = makeElement(
      "div",
      "review-stars"
    );

    if (rating === null) {
      container.appendChild(
        makeElement(
          "span",
          "review-rating-unknown",
          "Sterrenbeoordeling niet vermeld"
        )
      );

      return container;
    }

    container.setAttribute(
      "aria-label",
      rating + " van de 5 sterren"
    );

    for (let i = 1; i <= 5; i++) {
      const star = makeElement(
        "span",
        i <= rating
          ? "review-star filled"
          : "review-star",
        "★"
      );

      star.setAttribute("aria-hidden", "true");

      container.appendChild(star);
    }

    container.appendChild(
      makeElement(
        "span",
        "review-rating-label",
        rating + "/5"
      )
    );

    return container;
  }


  /* ========================================
     REVIEWS - SORTEREN
  ======================================== */

  function sortReviews(reviews, sortMode) {
    const result = reviews.map(function (review, index) {
      return {
        review: review,
        index: index
      };
    });

    result.sort(function (a, b) {
      const ratingA = getRating(a.review);
      const ratingB = getRating(b.review);

      const dateA = getReviewDate(a.review);
      const dateB = getReviewDate(b.review);

      if (
        sortMode === "rating-high" ||
        sortMode === "rating-low"
      ) {
        /*
         * Reviews zonder sterren komen onderaan.
         */

        if (ratingA === null && ratingB !== null) {
          return 1;
        }

        if (ratingB === null && ratingA !== null) {
          return -1;
        }

        if (ratingA !== null && ratingB !== null) {
          const difference = sortMode === "rating-high"
            ? ratingB - ratingA
            : ratingA - ratingB;

          if (difference !== 0) {
            return difference;
          }
        }
      }

      if (
        sortMode === "date-new" ||
        sortMode === "date-old"
      ) {
        /*
         * Reviews zonder datum komen onderaan.
         */

        if (!dateA && dateB) {
          return 1;
        }

        if (dateA && !dateB) {
          return -1;
        }

        if (dateA && dateB) {
          const difference = sortMode === "date-new"
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();

          if (difference !== 0) {
            return difference;
          }
        }
      }

      /*
       * Bij gelijke beoordeling of datum
       * behouden we de CMS-volgorde.
       */

      return a.index - b.index;
    });

    return result.map(function (item) {
      return item.review;
    });
  }


  /* ========================================
     REVIEWS - KAARTEN TONEN
  ======================================== */

  function displayReviews(sortMode) {
    const grid = byId("reviews-grid");

    if (!grid) {
      return;
    }

    const reviews = sortReviews(allReviews, sortMode);

    const fragment = document.createDocumentFragment();

    reviews.forEach(function (review) {
      const card = makeElement(
        "article",
        "review-page-card"
      );

      card.appendChild(createStars(review));

      card.appendChild(
        makeElement(
          "span",
          "review-page-quote",
          "”"
        )
      );

      card.appendChild(
        makeElement(
          "p",
          "",
          review.text || ""
        )
      );

      const footer = makeElement(
        "div",
        "review-page-footer"
      );

      footer.appendChild(
        makeElement(
          "div",
          "review-page-author",
          review.name || "Klant"
        )
      );

      const dateText = formatReviewDate(review);

      if (dateText) {
        footer.appendChild(
          makeElement(
            "time",
            "review-date",
            dateText
          )
        );

        footer.lastChild.dateTime = review.date;
      }

      card.appendChild(footer);

      fragment.appendChild(card);
    });

    if (!reviews.length) {
      const empty = makeElement(
        "div",
        "reviews-empty"
      );

      empty.appendChild(
        makeElement("span", "", "”")
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
     REVIEWS - SORTEERKNOP TONEN
  ======================================== */

  function createReviewsToolbar() {
    const grid = byId("reviews-grid");

    if (!grid) {
      return;
    }

    /*
     * Voorkomt dubbele sorteerbalken.
     */

    const oldToolbar = byId("reviews-toolbar");

    if (oldToolbar) {
      oldToolbar.remove();
    }

    const toolbar = makeElement(
      "div",
      "reviews-toolbar"
    );

    toolbar.id = "reviews-toolbar";

    const count = makeElement(
      "div",
      "reviews-count"
    );

    const amount = allReviews.length;

    count.appendChild(
      makeElement(
        "strong",
        "",
        amount + (amount === 1 ? " beoordeling" : " beoordelingen")
      )
    );

    count.appendChild(
      makeElement(
        "span",
        "",
        "Ervaringen van klanten"
      )
    );


    /* SORTEERVELD */

    const control = makeElement(
      "div",
      "reviews-sort-control"
    );

    const label = makeElement(
      "label",
      "",
      "Sorteren op"
    );

    label.htmlFor = "review-sort-select";

    const select = document.createElement("select");

    select.id = "review-sort-select";

    const options = [
      {
        value: "original",
        label: "Standaardvolgorde"
      },
      {
        value: "rating-high",
        label: "Hoogste sterren eerst"
      },
      {
        value: "rating-low",
        label: "Laagste sterren eerst"
      },
      {
        value: "date-new",
        label: "Nieuwste eerst"
      },
      {
        value: "date-old",
        label: "Oudste eerst"
      }
    ];

    options.forEach(function (option) {
      const element = document.createElement("option");

      element.value = option.value;

      element.textContent = option.label;

      select.appendChild(element);
    });

    select.addEventListener("change", function () {
      displayReviews(select.value);
    });

    control.append(label, select);

    toolbar.append(count, control);

    grid.parentNode.insertBefore(toolbar, grid);
  }


  /* ========================================
     REVIEWS - DATA VERWERKEN
  ======================================== */

  function renderReviews(reviews) {
    if (!Array.isArray(reviews)) {
      return;
    }

    allReviews = reviews.filter(function (review) {
      return (
        review &&
        typeof review === "object" &&
        review.published !== false &&
        typeof review.text === "string" &&
        review.text.trim().length > 0
      );
    });

    createReviewsToolbar();

    displayReviews("original");
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

    if (!image || !placeholder) {
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
    if (!data || typeof data !== "object") {
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


    /* ADRES */

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


    /* TELEFOON */

    const phone = byId("contact-phone");

    if (phone) {
      const url = safePhoneUrl(data.phone);

      if (url) {
        phone.href = url;
        phone.textContent = data.phone;
      } else {
        phone.removeAttribute("href");
        phone.textContent = "Nog niet beschikbaar";
      }
    }


    /* E-MAIL */

    const email = byId("contact-email");

    if (email) {
      const url = safeEmailUrl(data.email);

      if (url) {
        email.href = url;
        email.textContent = data.email;
      } else {
        email.removeAttribute("href");
        email.textContent = "Nog niet beschikbaar";
      }
    }


    /* GOOGLE MAPS */

    const maps = byId("contact-maps");

    if (maps) {
      const url = safeWebUrl(data.maps);

      if (url) {
        maps.href = url;
        maps.hidden = false;
      } else {
        maps.removeAttribute("href");
        maps.hidden = true;
      }
    }


    /* BELKNOP */

    const phoneButton = byId("contact-phone-button");

    if (phoneButton) {
      const url = safePhoneUrl(data.phone);

      if (url) {
        phoneButton.href = url;
        phoneButton.hidden = false;
      } else {
        phoneButton.hidden = true;
      }
    }


    /* AFSPRAAKKNOPPEN */

    const bookingUrl = safeWebUrl(data.booking_url);

    document.querySelectorAll(".booking-link").forEach(
      function (link) {
        if (bookingUrl) {
          link.href = bookingUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        } else {
          link.href = page === "contact"
            ? "#contactgegevens"
            : "contact.html";

          link.removeAttribute("target");
          link.removeAttribute("rel");
        }
      }
    );
  }


  /* ========================================
     HOMEPAGE LADEN
  ======================================== */

  async function loadHome() {
    const results = await Promise.allSettled([
      loadJson(DATA.home),
      loadJson(DATA.behandelingen),
      loadJson(DATA.overOns)
    ]);

    if (results[0].status === "fulfilled") {
      const home = results[0].value;

      if (home.hero) {
        setText("hero-eyebrow", home.hero.eyebrow);

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

    if (results[1].status === "fulfilled") {
      renderServices(
        results[1].value.services,
        "home-services-grid",
        2
      );
    }

    if (results[2].status === "fulfilled") {
      setText(
        "home-about-description",
        results[2].value.description
      );
    }
  }


  /* ========================================
     BEHANDELINGENPAGINA
  ======================================== */

  async function loadTreatments() {
    const data = await loadJson(DATA.behandelingen);

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
     OVER DE SALON + REVIEWS
  ======================================== */

  async function loadAbout() {
    const data = await loadJson(DATA.overOns);

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

    loadOptionalImage(
      "about-photo",
      "about-photo-placeholder",
      data.image,
      data.image_alt
    );

    renderReviews(data.reviews);
  }


  /* ========================================
     OPENINGSTIJDENPAGINA
  ======================================== */

  async function loadHours() {
    const data = await loadJson(DATA.openingstijden);

    setText(
      "hours-page-introduction",
      data.introduction
    );

    setText("hours-note", data.note);

    setText(
      "hours-extra-information",
      data.extra_information
    );

    renderOpeningHours(data.opening_hours);
  }


  /* ========================================
     CONTACTPAGINA
  ======================================== */

  async function loadContact() {
    const data = await loadJson(DATA.contact);

    renderContact(data);
  }


  /* ========================================
     BOEKINGSLINK OP ALLE PAGINA'S
  ======================================== */

  async function loadBookingLink() {
    const data = await loadJson(DATA.contact);

    renderContact(data);
  }


  /* ========================================
     WEBSITE STARTEN
  ======================================== */

  async function start() {
    addExtraStyles();

    renderHeader();

    renderFooter();

    initializeAnimations();

    const tasks = [];

    switch (page) {
      case "home":
        tasks.push(loadHome());
        break;

      case "behandelingen":
        tasks.push(loadTreatments());
        break;

      case "over-ons":
        tasks.push(loadAbout());
        break;

      case "openingstijden":
        tasks.push(loadHours());
        break;

      case "contact":
        tasks.push(loadContact());
        break;
    }

    if (page !== "contact") {
      tasks.push(loadBookingLink());
    }

    const results = await Promise.allSettled(tasks);

    results.forEach(function (result) {
      if (result.status === "rejected") {
        console.error(
          "Salon Jurgen - gegevens laden:",
          result.reason
        );
      }
    });
  }

  start();

})();
