import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ImageViewer from '../components/layout/ImageViewer';
import { cropViewport } from '../lib/ui';

import '../styles/global.scss';

// TODO: Current analytics is based on page changes but this has one page, use the buttons instead.

export default function Application({ Component, pageProps }) {
    // State for the image viewer (popup).
    const [viewerOpen, setViewerOpen] = useState(false);
    const viewerImageRef = useRef();

    const openImage = img => {
        // The the full size image for the slide.        
        viewerImageRef.current.style.backgroundImage = 
            `url(${img.src})`;

        // Crop the window to prevent scrolling whilst fixed.
        cropViewport();

        // Open the image viewer via state.
        setViewerOpen(img.redirect || true);
    };

    const router = useRouter();

    const handleRouteChange = (url) => {
      if (typeof window.gtag === 'function') {
        window?.gtag('config', 'G-NQLG2NJ26D', { page_path: url });
      }
    };
  
    useEffect(() => {
      router.events.on('routeChangeComplete', handleRouteChange);
      return () => router.events.off('routeChangeComplete', handleRouteChange);
    }, [router.events]);

    return <>
        <Head>
            <title>Electric Doctors: Alleviating your electrical pains!</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0" />
        </Head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-NQLG2NJ26D"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NQLG2NJ26D');
            `,
          }}
        />
        <Component 
            {...pageProps} 
            viewerOpen={viewerOpen}
            setViewerOpen={setViewerOpen}
            viewerImageRef={viewerImageRef}
            openImage={openImage}
        />
        <ImageViewer 
            viewerOpen={viewerOpen}
            setViewerOpen={setViewerOpen}
            viewerImageRef={viewerImageRef}
        />
    </>
}