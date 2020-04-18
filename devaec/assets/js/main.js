const url = 'assets/documents/test.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false
    pageNumIsPending = null;

const scale = 0.8,
      canvas = document.querySelector("#pdf-render"),
      ctx = canvas.getContext('2d');

// render Page
const renderPage = num => {
  pageIsRendering = true;

  // Get the page 
  pdfDoc.getPage(num)
  .then( page =>{
    // set scale
    const viewport = page.getViewport({scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx  = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx)
    .promise
    .then(()=>{
      pageIsRendering = false;

      if(pageNumIsPending !== null){
        renderPage(pageNumIsPending);
        pageNumIsPending=null;
      }
    });

    //Output current page
    document.querySelector("#page-num").textContent = num;
  });
};

// Check if the page is rendering
const queueRenderPage = num => {
  if(pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
}

// show previous page
const showPrevPage = () =>{
  if(pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}

// show next page
const showNextPage = () =>{
  if(pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}

// Get Document
pdfjsLib.getDocument(url)
  .promise
  .then(pdfDoc_ =>{
    pdfDoc = pdfDoc_;
    document.querySelector("#page-count").textContent = pdfDoc.numPages;
    renderPage(pageNum);
    //console.log(pdfDoc);
  });


// button events
document.querySelector("#prev-page").addEventListener('click', showPrevPage);
document.querySelector("#next-page").addEventListener('click', showNextPage);