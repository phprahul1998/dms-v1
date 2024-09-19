"use client"
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const WebViewer = dynamic(() => import('@pdftron/webviewer'), {
  ssr: false,
});

const ESign = () => {
  const viewer = useRef(null);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    const loadWebViewer = async () => {
      const WebViewer = (await import('@pdftron/webviewer')).default;
      if (viewer.current) {
        const instance = await WebViewer(
          {
            path: '/public',
            initialDoc: `/dd12-13_0.pdf`,
            licenseKey: 'com:7e21f8520200000000618c555797d7f4d14f2a4429252c10aa86a6a129', // sign up to get a key at https://dev.apryse.com

          },
          viewer.current
        );
        setInstance(instance);
      }
    };
    loadWebViewer();
  }, []);

  const handleDownload = async () => {
    if (instance) {
      const { documentViewer, annotationManager } = instance.Core;
      
      // Get the current document
      const doc = documentViewer.getDocument();
      
      // Create a new Uint8Array to store the PDF data
      const pdfBytes = await doc.getFileData({
        // Include any annotations that have been added
        xfdfString: await annotationManager.exportAnnotations()
      });
      
      // Convert the Uint8Array to a Blob
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'edited_document.pdf';
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className='webViewer flex-grow' ref={viewer} style={{height:"100vh"}} />
      {/* <button 
        onClick={handleDownload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4 mx-auto"
      >
        Download Edited PDF
      </button> */}
    </div>
  );
}

export default ESign;