const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

searchToggle.addEventListener("click", () => {
  searchBar.classList.toggle("active");
});
