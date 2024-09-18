"use client"
import {useEffect, useRef} from 'react';
import dynamic from 'next/dynamic';
const WebViewer = dynamic(() => import('@pdftron/webviewer'), {
  ssr: false,
});
 const  ESign = () => {
  const viewer = useRef(null);

  useEffect(() => {
    const loadWebViewer = async () => {
      const WebViewer = (await import('@pdftron/webviewer')).default;
      if (viewer.current) {
        WebViewer(
          {
            path: '/public',
            initialDoc: ``,
          },
          viewer.current
        );
      }
    };
    loadWebViewer();
  }, []);

    return (
        <div className="">
          
            <div className='webViewer' ref={viewer} style={{ height: '100vh' }} /> 
        </div>
    );
}
export default ESign