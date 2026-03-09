const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");

function closeMenu() {
  if (mobileMenu && menuToggle) {
    mobileMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

function closeSearch() {
  if (searchBar && searchToggle) {
    searchBar.classList.remove("active");
    searchToggle.setAttribute("aria-expanded", "false");
  }
}

function toggleMenu() {
  if (!mobileMenu || !menuToggle) return;

  const isOpen = mobileMenu.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    closeSearch();
  }
}

function toggleSearch() {
  if (!searchBar || !searchToggle) return;

  const isOpen = searchBar.classList.toggle("active");
  searchToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    closeMenu();
  }
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", toggleMenu);
}

if (searchToggle && searchBar) {
  searchToggle.addEventListener("click", toggleSearch);
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (
    mobileMenu &&
    menuToggle &&
    !mobileMenu.contains(target) &&
    !menuToggle.contains(target)
  ) {
    closeMenu();
  }

  if (
    searchBar &&
    searchToggle &&
    !searchBar.contains(target) &&
    !searchToggle.contains(target)
  ) {
    closeSearch();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeSearch();
  }
});

if (mobileMenu) {
  const menuLinks = mobileMenu.querySelectorAll("a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });
}
