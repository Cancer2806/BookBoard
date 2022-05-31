const slider = document.querySelector('.recent-content');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;
  console.log(walk);
});

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