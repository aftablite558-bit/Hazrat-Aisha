import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    const defaultTitle = 'Hazrat Aisha Academy';
    const defaultDesc = 'Hazrat Aisha Academy in Chak Rajopatti, Sitamarhi, Bihar — a premium Islamic school blending CBSE-aligned modern academic excellence with authentic Islamic values.';

    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || defaultDesc);
    }
  }, [title, description]);

  return null;
}
