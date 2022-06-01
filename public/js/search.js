const toggleFilters = document.querySelector(".toggle-filters")
const filtersWrapper = document.querySelector(".filters-wrapper")

toggleFilters.addEventListener("click", function() {
  if (filtersWrapper.style.display === "none") {
    filtersWrapper.style.display = "block"
  } else {
    filtersWrapper.style.display = "none"
  }
})

