const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

if (searchToggle && searchBar) {
  searchToggle.addEventListener("click", () => {
    searchBar.classList.toggle("active");
  });
}
