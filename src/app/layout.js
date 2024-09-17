import Script from 'next/script'
import "./assets/css/backend.css";
import 'remixicon/fonts/remixicon.css';
import  "bootstrap/dist/css/bootstrap.min.css"
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";
import { ToastContainer } from 'react-toastify';
import SessionProviderWrapper from './component/SessionProviderWrapper';
import 'react-toastify/dist/ReactToastify.css';
export const metadata = {
  title: "Softage DMS",
  description: "Softage DMS",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
  ],
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body> <SessionProviderWrapper>
          {children}
      </SessionProviderWrapper><ToastContainer /></body>
      <Script  src="/js/jquery.min.js"/>
      <Script  src="/js/backend-bundle.min.js" strategy="afterInteractive"/>
      <Script  src="/js/app.js" strategy="afterInteractive"/>
    </html>
  );
}
