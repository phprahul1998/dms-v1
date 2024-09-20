"use client";
import React, { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import Link from "next/link";
import '../assets/css/sign.css'
import Allsign from '../component/Allsign'
const Sign = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [draggedSignature, setDraggedSignature] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [key, setKey] = useState(0); // For re-rendering
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const iframeRef = useRef(null);

  // Replace the text signatures with image URLs or base64 data URIs


  useEffect(() => {
    loadPdf();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        setScale(width / 612);
        drawSignatures();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [signatures, currentPage]);

  async function loadPdf() {
    const url = "/document.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    setTotalPages(pdfDoc.getPageCount());
    const pdfBlob = new Blob([existingPdfBytes], { type: "application/pdf" });
    const initialPdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(initialPdfUrl);
  }

  const drawSignatures = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    signatures
      .filter(sig => sig.page === currentPage)
      .forEach(({ img, x, y, width, height }) => {
        const image = new Image();
        image.src = img;
        image.onload = () => {
          ctx.drawImage(image, x * scale, y * scale, width * scale, height * scale);
        };
      });
  };

  const handleDragStart = (signature, e) => {
    setDraggedSignature(signature);
    e.dataTransfer.setData('image/png', signature.src);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (!draggedSignature) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;
    setSignatures(prev => [
      ...prev, 
      { 
        img: draggedSignature.src, 
        x, 
        y, 
        page: currentPage, 
        width: draggedSignature.width, 
        height: draggedSignature.height 
      }
    ]);
    setDraggedSignature(null);
    drawSignatures();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setKey(prevKey => prevKey + 1);
    }
  };

  async function savePdf() {
    const url = "/document.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    for (const { img, x, y, page, width, height } of signatures) {
      const pageObj = pages[page - 1];
      const { height: pdfHeight } = pageObj.getSize();
      const imgBytes = await fetch(img).then((res) => res.arrayBuffer());
      const pdfImage = await pdfDoc.embedPng(imgBytes);
      
      pageObj.drawImage(pdfImage, {
        x,
        y: pdfHeight - y - height, // Adjust to PDF coordinate system
        width,
        height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const savedPdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
    link.href = savedPdfUrl;
    link.download = 'signed_document.pdf';
    link.click();
  }

  return (
    <>
      <div style={{ width: "100%" }} className="iq-top-navbar">
        <div className="iq-navbar-custom">
          <nav className="fileviewheader navbar navbar-expand-lg navbar-light mt-2 ">
            <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
              <div className="sign">
                <Link href="/sign" className="navbar-brand header-logo iq-navbar-logo">
                  <i className="las la-signature"></i>
                </Link>
              </div>
              <div className="">
                <h6 className="m-0 file_details">New Sign Request</h6>
                <Link className="parent-section" href="/sign">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="folder-icon"
                    focusable="false"
                    aria-hidden="true"
                    role="presentation"
                  >
                    <path
                      fill="#909090"
                      fillRule="evenodd"
                      d="M6.6 2L8 3.375h5.6c.77 0 1.4.619 1.4 1.375v6.875c0 .756-.63 1.375-1.4 1.375H2.4c-.77 0-1.4-.619-1.4-1.375l.007-8.25C1.007 2.619 1.63 2 2.4 2h4.2zM13 5H3v1h10V5z"
                    ></path>
                  </svg>
                  &nbsp;My Sign Requests
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="container-fluid Esign">
        <div className="row">
        <div className="col-md-9 iframe-wrapper" ref={containerRef} style={{ position: 'relative', height: '80vh' }}>
        {pdfUrl && (
              <iframe 
                key={key} 
                ref={iframeRef}
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&page=${currentPage}&zoom=${scale * 27}`}
                width="100%"
                height="100%"
                style={{
                  border: 'none',
                  overflow: 'hidden', 
                  height: '100%', 
                }}
                title="PDF Document"
              />
            )}
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </div>
          <div className="col-md-3">
            <h5>Signatures</h5>
            <Allsign handleDragStart={handleDragStart}/>
            
            {/* <div className="mt-3">
              <button className="btn btn-sm btn-primary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
              <span> Page {currentPage} of {totalPages} </span>
              <button  className="btn btn-sm btn-primary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
            <button
 onClick={savePdf} className="btn btn-primary mt-3">Save PDF</button> */}
        </div>
      </div>
    </div>
   </>
  );
};

export default Sign;