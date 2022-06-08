const toggleFilters = document.querySelector(".toggle-filters")
const filtersWrapper = document.querySelector(".filters-wrapper")

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.228/pdf.worker.min.js";

function makeThumb(page) {
  // draw page to fit into 96x96 canvas
  var vp = page.getViewport(1);
  const outputScale = window.devicePixelRatio || 1;

  var canvas = document.createElement("canvas");
  canvas.width = Math.floor(vp.width * outputScale);
  canvas.height = Math.floor(vp.height * outputScale);
  canvas.style.width = "auto";
  canvas.style.height = "100%";
  const transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

  return page
    .render({
      canvasContext: canvas.getContext("2d"),
      viewport: page.getViewport(1),
    })
    .promise.then(function () {
      return canvas;
    });
}
var LoadFirstImages=async (url,div_id,isSmall) =>{
   await pdfjsLib
      .getDocument(url)
      .promise.then(function (doc) {
        var max_pages = 1;
        var pages = [];
        while (pages.length < max_pages) pages.push(pages.length + 1);
        return Promise.all(
          pages.map(function (num) {
            // create a div for each page and build a small canvas for it
           
            return doc
              .getPage(num)
              .then(makeThumb)
              .then(function (canvas) {
                if(isSmall)
                {
                  canvas.style.width = "140px";
                  canvas.style.height = "auto";
                }
                div_id.appendChild(canvas);
              });
          })
        );
      })
      .catch(console.error);
  }
  var uploadbooks=document.querySelector(".search-results").children;
  for (let i = 0; i < uploadbooks.length; i++) {
    var url=uploadbooks[i].querySelector('#hiddurl').value;

     LoadFirstImages(url,uploadbooks[i].querySelector('#cover_img'),true);
  }
toggleFilters.addEventListener("click", function() {
  if (filtersWrapper.style.display === "none") {
    filtersWrapper.style.display = "block"
  } else {
    filtersWrapper.style.display = "none"
  }
})

