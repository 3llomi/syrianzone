import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Announces client-side (Inertia) navigations to screen readers and moves focus
 * to the main landmark, so a page change is perceivable without a full reload.
 *
 * On the first render it does nothing (the browser already announced the
 * initial document). On every subsequent url change it focuses #main-content and
 * posts the new document title to a polite live region.
 */
export default function RouteAnnouncer() {
  const { url } = usePage();
  const firstRender = useRef(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // let the page commit and the <Head> title update before announcing
    const timer = window.setTimeout(() => {
      setMessage(document.title);
      const main = document.getElementById('main-content');
      if (main) {
        main.focus({ preventScroll: true });
      }
    }, 80);
    return () => window.clearTimeout(timer);
  }, [url]);

  return (
    <div role="status" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
