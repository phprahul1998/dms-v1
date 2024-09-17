"use client"
import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';

const Sign = () => {
  const viewerRef = useRef(null);
  const [viewerInitialized, setViewerInitialized] = useState(false);

  useEffect(() => {
    if (viewerInitialized) {
      return;
    }

    WebViewer(
      {
        path: '/public', // Path to the copied WebViewer assets
        initialDoc: '/document.pdf', // The PDF file to load
      },
      viewerRef.current
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      // Add a signature field when the document is loaded
      documentViewer.addEventListener('documentLoaded', () => {
        const signatureField = new Annotations.Forms.Field("Signature1", {
          type: 'Sig',
          name: 'Signature'
        });

        const widgetAnnot = new Annotations.SignatureWidgetAnnotation(signatureField, {
          appearance: '_DEFAULT',
          appearances: {
            _DEFAULT: {
              Normal: {
                data: 'Your Signature Here',
              }
            }
          }
        });

        // Customize the signature field's position and size
        widgetAnnot.PageNumber = 1;
        widgetAnnot.X = 100;
        widgetAnnot.Y = 150;
        widgetAnnot.Width = 200;
        widgetAnnot.Height = 50;

        annotationManager.addAnnotation(widgetAnnot);
        annotationManager.redrawAnnotation(widgetAnnot);
        annotationManager.getFieldManager().addField(signatureField);
      });

      setViewerInitialized(true);
    });

    return () => {
      if (viewerInitialized && viewerRef.current) {
        WebViewer.unload(viewerRef.current);
      }
    };
  }, [viewerInitialized]);

  return (
    <div>
      <div ref={viewerRef} style={{ height: '100vh', width: '100%' }}></div>
    </div>
  );
};

export default Sign;
