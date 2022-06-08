//
// The workerSrc property shall be specified.
//
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

function LoadThumbImages(url) {
  pdfjsLib
    .getDocument(url)
    .promise.then(function (doc) {
      var max_pages = doc.numPages > 4 ? 4 : doc.numPages;
      var pages = [];
      while (pages.length < max_pages) pages.push(pages.length + 1);
      return Promise.all(
        pages.map(function (num) {
          // create a div for each page and build a small canvas for it
          var div = document.querySelector("#preview-img");
          return doc
            .getPage(num)
            .then(makeThumb)
            .then(function (canvas) {
              canvas.style.width = "140px";
              canvas.style.height = "auto";
              div.appendChild(canvas);
            });
        })
      );
    })
    .catch(console.error);
}
function LoadFirstImages(url) {
  pdfjsLib
    .getDocument(url)
    .promise.then(function (doc) {
      var max_pages = 1;
      var pages = [];
      while (pages.length < max_pages) pages.push(pages.length + 1);
      return Promise.all(
        pages.map(function (num) {
          // create a div for each page and build a small canvas for it
          var div = document.querySelector("#img_main");

          return doc
            .getPage(num)
            .then(makeThumb)
            .then(function (canvas) {
               
              div.appendChild(canvas);
            });
        })
      );
    })
    .catch(console.error);
}

var url = document.querySelector("#hiddurl").value.trim();
LoadThumbImages(url);
LoadFirstImages(url);
