/**
 * Apply saved theme before page paint to prevent flash of wrong theme.
 */
(function () {
  "use strict";
  var stored = localStorage.getItem("theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (stored === "dark" || (!stored && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
