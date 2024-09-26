import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import "../assets/css/pdfviewer.css";
import { toast } from 'react-toastify';
import Allpdffile from '../component/Allpdffile'
const PDFViewer = forwardRef(({ signAdoptImage }, ref) => {
  const pdfContainerRef = useRef(null);
  const pdfCanvasRef = useRef(null);
  const draggableImageRef = useRef(null);
  const uploadPdfRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [imgX, setImgX] = useState(0);
  const [imgY, setImgY] = useState(0);
  const [imagePositions, setImagePositions] = useState({});
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [fileName, setFileName] = useState('')
  const [showPopup, setShowPopup] = useState(false);
  const property = {
    position: "top-right",
    autoClose: 800,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: "colored",
  }

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum);
    }
  }, [pdfDoc, pageNum]);

  useEffect(() => {
    if (signAdoptImage && draggableImageRef.current) {
      draggableImageRef.current.src = signAdoptImage;
      draggableImageRef.current.style.display = 'block';
    }
  }, [signAdoptImage]);

  useImperativeHandle(ref, () => ({
    savePdf: handleSavePdf
  }));

  const onButtonClick = () => {
    if (uploadPdfRef.current) {
      uploadPdfRef.current.click();
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name)
      const arrayBuffer = await file.arrayBuffer();
      const loadedPdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(loadedPdfDoc);
      setPageCount(loadedPdfDoc.getPageCount());
      setIsPdfUploaded(true);
    }
  };

  const renderPage = async (pageNumber) => {
    const pdf = await pdfjsLib.getDocument({ data: await pdfDoc.save() }).promise;
    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({ scale: 1.5 });
    const context = pdfCanvasRef.current.getContext('2d');
    pdfCanvasRef.current.height = viewport.height;
    pdfCanvasRef.current.width = viewport.width;
    setPageWidth(viewport.width);
    setPageHeight(viewport.height);
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    if (imagePositions[pageNumber]) {
      const position = imagePositions[pageNumber];
      draggableImageRef.current.style.left = `${position.x - pdfContainerRef.current.scrollLeft}px`;
      draggableImageRef.current.style.top = `${position.y - pdfContainerRef.current.scrollTop}px`;
      draggableImageRef.current.style.display = 'block';
    } else {
      draggableImageRef.current.style.display = 'none';
    }
  };

  const handlePrevPage = () => {
    if (pageNum <= 1) return;
    saveCurrentPageImagePosition();
    setPageNum(pageNum - 1);
  };

  const handleNextPage = () => {
    if (pageNum >= pageCount) return;
    saveCurrentPageImagePosition();
    setPageNum(pageNum + 1);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left + pdfContainerRef.current.scrollLeft - draggableImageRef.current.width / 2;
    const newY = e.clientY - rect.top + pdfContainerRef.current.scrollTop - draggableImageRef.current.height / 2;

    draggableImageRef.current.style.left = `${newX - pdfContainerRef.current.scrollLeft}px`;
    draggableImageRef.current.style.top = `${newY - pdfContainerRef.current.scrollTop}px`;
    draggableImageRef.current.style.display = 'block';

    setImgX(newX);
    setImgY(newY);

    setImagePositions((prev) => ({
      ...prev,
      [pageNum]: { x: newX, y: newY },
    }));
  };

  const handleSavePdf = async () => {
    if (!pdfDoc) {
      toast.warn('Please Upload or Select file',property);
      return;
    }
    saveCurrentPageImagePosition();
    for (let i = 1; i <= pageCount; i++) {
      if (!imagePositions[i]) continue;

      const page = pdfDoc.getPage(i - 1);
      const imageUrl = draggableImageRef.current.src;
      const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
      const embeddedImage = await pdfDoc.embedPng(imageBytes);
      const imageDims = embeddedImage.scale(0.5);
      const pdfX = (imagePositions[i].x / pageWidth) * page.getWidth();
      const pdfY = page.getHeight() - (imagePositions[i].y / pageHeight) * page.getHeight() - imageDims.height;
      page.drawImage(embeddedImage, {
        x: pdfX,
        y: pdfY,
        width: imageDims.width,
        height: imageDims.height,
      });
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modified.pdf';
    link.click();

  };
  const saveCurrentPageImagePosition = () => {
    if (draggableImageRef.current.style.display !== 'none') {
      setImagePositions((prev) => ({
        ...prev,
        [pageNum]: { x: imgX, y: imgY },
      }));
    }
  };
  const getAllpdf =()=>{
    setShowPopup(true)
  }

  return (
    <>
      {!isPdfUploaded ? (
        <div className='p-container'>
          <div className='dropFIle'>
            <h1>Choose or Upload a Document</h1>
            <p>choose a file from  <span onClick={onButtonClick}> your desktop</span> or <span onClick={getAllpdf}>
              file from SoftDocs
            </span>.</p>
            <div className='file-picker-box' role="group">
              <i
                id="btnGroupDrop1"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                className="las la-plus-circle"
              ></i>
              <div className="dropdown-menu dropmenu" aria-labelledby="btnGroupDrop1">
                <a className="dropdown-item" href="#" onClick={getAllpdf}>Choose from SoftDocs</a>
                <a className="dropdown-item" href="#" onClick={onButtonClick}>
                  Upload file
                </a>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div style={{ padding: '8px' }}>
          <div id="controls" style={{ justifyContent: 'space-between' }}>
            <div style={{ padding: '10px' }}>
              <div className="d-flex mb-2 filenamesection">
                <div className="file"><svg width="32" height="32" viewBox="0 0 32 32" focusable="false" aria-hidden="true" role="presentation"><g fill="none"><path fill="#D0021B" d="M9 3h9.586a1 1 0 01.707.293l6.415 6.414a1 1 0 01.293.707V26A3 3 0 0123 29H9a3 3 0 01-3-3V6a3 3 0 013-3z" ></path><path fill="#fff" fillOpacity="0.5" d="M19.286 3.286l5.01 5.009 1.412 1.412a1 1 0 01.203.293H21a2 2 0 01-2-2V3.09a1 1 0 01.286.196z"></path><path fill="#fff" d="M13.133 16.998c0 .354-.054.66-.162.918a1.745 1.745 0 01-1.044 1.012 2.057 2.057 0 01-.693.122h-.621v2.322H9.2V15h1.98c.228 0 .457.033.688.099a1.655 1.655 0 011.089.945c.118.258.176.576.176.954zm-1.35.027c0-.288-.069-.495-.207-.621a.72.72 0 00-.504-.189h-.459v1.665h.459a.665.665 0 00.504-.22c.138-.148.207-.359.207-.635zm6.854 1.179c0 .48-.052.915-.157 1.305-.106.39-.266.723-.482.999a2.14 2.14 0 01-.824.639c-.333.15-.727.225-1.183.225H14.2V15h1.791c.456 0 .85.075 1.183.225.334.15.608.364.824.643.216.28.376.615.482 1.008.105.394.157.836.157 1.328zm-1.449 0c0-.642-.11-1.126-.328-1.454-.22-.327-.503-.49-.851-.49h-.351v3.852h.351c.348 0 .631-.163.85-.49.22-.328.329-.8.329-1.418zm3.961-1.899v1.296h1.521v1.233h-1.512v2.538H19.7V15h3.105v1.305h-1.656z"></path></g></svg> <span>{fileName} . {pageCount} pages</span></div>
                <div className="ms-auto ">
                  <button className='btn btn-sm btn-secondary' onClick={handlePrevPage} disabled={!isPdfUploaded}>
                    <i className="las la-caret-square-left"></i>
                  </button>
                  <span id="pageInfo">
                    Page <span>{pageNum}</span> of <span>{pageCount}</span>
                  </span>
                  <button className='btn btn-sm btn-secondary' onClick={handleNextPage} disabled={!isPdfUploaded}>
                    <i className="las la-caret-square-right"></i>
                  </button>
                  <button role="group" className='ml-4 btn btn-sm btn-secondary dropdown-toggle' id="btnGroupDrop1"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">Replace</button>
                  <div className="dropdown-menu dropmenu" aria-labelledby="btnGroupDrop1">
                    <a className="dropdown-item" href="#">Choose from SoftDocs</a>
                    <a className="dropdown-item" href="#" onClick={onButtonClick}>
                      Upload file
                    </a>
                  </div>

                </div>

              </div>

            </div>
            <img
              ref={draggableImageRef}
              src="https://via.placeholder.com/100"
              className="draggable"
              style={{
                position: 'absolute',
                width: '200px',
                cursor: 'move',
                display: 'none',
                zIndex: 1,
              }}
            />
          </div>
          <div
            ref={pdfContainerRef}
            id="pdf-container"
            style={{

              position: 'relative',
              overflow: 'auto',
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <canvas id="pdf-canvas" ref={pdfCanvasRef}></canvas>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={uploadPdfRef}
        onChange={handlePdfUpload}
        accept=".pdf"
        style={{ display: 'none' }}
      />
      {/* <Allpdffile show={showPopup} handleClose={() => setShowPopup(false)}  />         */}

    </>
  );
});

export default PDFViewer;
