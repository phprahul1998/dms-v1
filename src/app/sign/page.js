"use client";
import { useState, useRef, useEffect } from "react";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Link from "next/link";

const Sign = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [draggedSignature, setDraggedSignature] = useState(null); // For signature dragging
  const [droppedSignatures, setDroppedSignatures] = useState([]); // Store all dropped signatures and coordinates
  const iframeRef = useRef(null);
  const signatures = ["John Doe", "Jane Smith", "Signature Here"];

  // Load the PDF on mount
  useEffect(() => {
    loadPdf();
  }, []);

  async function loadPdf() {
    const url = "https://pdf-lib.js.org/assets/with_update_sections.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfBlob = new Blob([existingPdfBytes], { type: "application/pdf" });
    const initialPdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(initialPdfUrl); // Load the original PDF in iframe
  }

  // Function to handle dynamic coordinates and modify the PDF
  async function modifyPdf() {
    const url = "https://pdf-lib.js.org/assets/with_update_sections.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize(); // Get page height for y-axis correction

    // Draw all the dropped signatures
    droppedSignatures.forEach(({ signature, x, y }) => {
      firstPage.drawText(signature, {
        x: x,
        y: height - y, // Invert y-axis because PDFs have the origin at the bottom-left
        size: 30,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        rotate: degrees(0),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const modifiedPdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(modifiedPdfUrl); // Update iframe with the modified PDF
  }

  // Function to handle drag start (capture the signature being dragged)
  const handleDragStart = (signature) => {
    setDraggedSignature(signature);
  };

  // Function to handle drop on the PDF iframe
  const handleDrop = (event) => {
    event.preventDefault();
    const iframeRect = iframeRef.current.getBoundingClientRect();
    const x = event.clientX - iframeRect.left;
    const y = event.clientY - iframeRect.top;

    // Add the new signature with its drop coordinates to the list
    setDroppedSignatures((prev) => [...prev, { signature: draggedSignature, x, y }]);
    setDraggedSignature(null); // Reset the dragged signature
  };

  // Allow drag over the iframe
  const handleDragOver = (event) => {
    event.preventDefault();
  };

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

      <div className="col-md-3 bg-light">
        {/* List of Signatures */}
        <div className="signature-list">
          <h6>Available Signatures:</h6>
          {signatures.map((signature, index) => (
            <div
              key={index}
              className="signature-item"
              draggable="true"
              onDragStart={() => handleDragStart(signature)}
              style={{
                padding: "5px",
                margin: "5px 0",
                border: "1px solid #ccc",
                cursor: "move",
                backgroundColor: "#f5f5f5",
              }}
            >
              {signature}
            </div>
          ))}
        </div>
      </div>

      <div
        className="col-md-9"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ position: "relative", cursor: "pointer" }}
      >
        <div className="Esign" style={{ position: "relative" }}>
          {pdfUrl && (
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              width="100%"
              height="600px"
              style={{ border: "none", pointerEvents: "none" }} // Disable pointer events on iframe
              title="Modified PDF"
            />
          )}

          {/* Render all dropped signatures as previews */}
          {droppedSignatures.map(({ signature, x, y }, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                pointerEvents: "none", // Disable interaction with the signature while dragging
                fontSize: "30px",
                color: "black",
                fontFamily: "Helvetica",
              }}
            >
              {signature}
            </div>
          ))}
        </div>
      </div>

      <div className="col-md-12 text-center">
        {/* Button to save and modify the PDF with all signatures */}
        {pdfUrl && (
          <button
            onClick={modifyPdf}
            className="btn btn-primary mt-4"
          >
            Save & Download PDF
          </button>
        )}
      </div>
    </>
  );
};

export default Sign;
