"use client";
import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";

export default function Sign() {
  const viewerDiv = useRef(null);
  const beenInitialised = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !beenInitialised.current) {
      beenInitialised.current = true;
      WebViewer(
        {
          path: "/public",
          initialDoc: "https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf",
          licenseKey: "your_license_key",
        },
        viewerDiv.current
      ).then(() => {
        // WebViewer loaded successfully
      });
    }
  }, []);

  return (
    <div className="MyComponent">
      <div className="webViewer" ref={viewerDiv} style={{ height: "100vh" }} />
    </div>
  );
}
