/**
 * Paul Varghese Portfolio — Main JavaScript
 * Handles navigation, form validation, scroll animations, and accessibility.
 */

(function () {
  "use strict";

  /* --- Theme Toggle --- */
  var themeToggle = document.getElementById("theme-toggle");

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function setTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
    updateThemeToggleUI();
  }

  function updateThemeToggleUI() {
    if (!themeToggle) return;
    var isDark = getTheme() === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  if (themeToggle) {
    updateThemeToggleUI();
    themeToggle.addEventListener("click", function () {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }

  /* --- Mobile Navigation --- */
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      siteNav.classList.toggle("open");
    });

    /* Close menu when a nav link is clicked */
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("open");
      });
    });

    /* Close menu on Escape key */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("open")) {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("open");
        navToggle.focus();
      }
    });
  }

  /* --- Scroll-triggered Fade-in Animations --- */
  const fadeElements = document.querySelectorAll(".fade-in");

  if (fadeElements.length > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* --- Skill Bar Animation --- */
  const skillBars = document.querySelectorAll(".skill-bar-fill");

  if (skillBars.length > 0) {
    const barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillBars.forEach(function (bar) {
      barObserver.observe(bar);
    });
  }

  /* --- Contact Form Validation --- */
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    const fields = {
      name: {
        input: document.getElementById("full-name"),
        error: document.getElementById("name-error"),
        validate: function (value) {
          if (!value.trim()) return "Full name is required.";
          if (value.trim().length < 2) return "Name must be at least 2 characters.";
          return "";
        },
      },
      email: {
        input: document.getElementById("email"),
        error: document.getElementById("email-error"),
        validate: function (value) {
          if (!value.trim()) return "Email address is required.";
          var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!pattern.test(value.trim())) return "Please enter a valid email address.";
          return "";
        },
      },
      subject: {
        input: document.getElementById("subject"),
        error: document.getElementById("subject-error"),
        validate: function (value) {
          if (!value.trim()) return "Subject is required.";
          if (value.trim().length < 3) return "Subject must be at least 3 characters.";
          return "";
        },
      },
      message: {
        input: document.getElementById("message"),
        error: document.getElementById("message-error"),
        validate: function (value) {
          if (!value.trim()) return "Message is required.";
          if (value.trim().length < 10) return "Message must be at least 10 characters.";
          return "";
        },
      },
    };

    var formSuccess = document.getElementById("form-success");

    /* Validate a single field and update UI */
    function validateField(field) {
      var errorMessage = field.validate(field.input.value);
      var hasError = errorMessage !== "";

      field.input.classList.toggle("error", hasError);
      field.input.setAttribute("aria-invalid", String(hasError));
      field.error.textContent = errorMessage;
      field.error.classList.toggle("visible", hasError);

      return !hasError;
    }

    /* Real-time validation on blur */
    Object.keys(fields).forEach(function (key) {
      fields[key].input.addEventListener("blur", function () {
        validateField(fields[key]);
      });

      fields[key].input.addEventListener("input", function () {
        if (fields[key].input.classList.contains("error")) {
          validateField(fields[key]);
        }
      });
    });

    /* Form submission */
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var isValid = true;
      var firstInvalidField = null;

      Object.keys(fields).forEach(function (key) {
        if (!validateField(fields[key])) {
          isValid = false;
          if (!firstInvalidField) {
            firstInvalidField = fields[key].input;
          }
        }
      });

      if (!isValid) {
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
        return;
      }

      /* Simulate successful submission (no backend) */
      if (formSuccess) {
        formSuccess.classList.add("visible");
        formSuccess.setAttribute("role", "alert");
      }

      contactForm.reset();

      Object.keys(fields).forEach(function (key) {
        fields[key].input.classList.remove("error");
        fields[key].input.setAttribute("aria-invalid", "false");
        fields[key].error.classList.remove("visible");
      });

      if (formSuccess) {
        formSuccess.focus();
      }
    });
  }
})();
