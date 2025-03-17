// components/JsonLd.jsx
import { useEffect } from 'react';

export function JsonLd({ data }) {
  useEffect(() => {
    // Create script element if it doesn't exist
    let scriptTag = document.querySelector(`script[data-json-ld="${data['@type']}"]`);
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-json-ld', data['@type']);
      document.head.appendChild(scriptTag);
    }

    // Set content
    scriptTag.textContent = JSON.stringify(data);

    return () => {
      document.head.removeChild(scriptTag);
    };
  }, [data]);

  return null;
}