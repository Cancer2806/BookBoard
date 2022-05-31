const menuButton = document.querySelector(".menu-button")
const menuClose = document.querySelector(".menu-close")
const hMenu = document.querySelector(".h-menu")

menuButton.addEventListener("click", function() {
  menuButton.style.display = "none";
  menuClose.style.display = "flex";
  hMenu.style.display = "block";
})

menuClose.addEventListener("click", function() {
  menuButton.style.display = "flex";
  menuClose.style.display = "none";
  hMenu.style.display = "none";
})