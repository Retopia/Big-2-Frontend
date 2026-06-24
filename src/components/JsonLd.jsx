// components/JsonLd.jsx
import { useEffect } from 'react';

export function JsonLd({ data }) {
  // Serialize so the effect only re-runs when the content actually changes, not on
  // every render (callers often pass a fresh object literal).
  const serialized = JSON.stringify(data);

  useEffect(() => {
    const type = data['@type'];
    let scriptTag = document.querySelector(`script[data-json-ld="${type}"]`);

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-json-ld', type);
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = serialized;

    return () => {
      // Guard against the node already being gone (StrictMode double-invoke, etc.).
      scriptTag.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);

  return null;
}