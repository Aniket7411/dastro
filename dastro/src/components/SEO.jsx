import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '../utils/brandAssets';

const SEO = ({ title, description, url, image }) => {
  const defaultTitle = `${SITE_NAME} | Learn Astrology & Book Consultations`;
  const defaultDescription = `Live astrology courses, personalised kundali consultations & astrology merchandise. Join ${SITE_NAME} today.`;
  const defaultImage = "/images/banner.jpg";
  const defaultUrl = "https://dsastroinstitute.com";

  const seoTitle = title ? `${title} | ${SITE_NAME}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${defaultUrl}${url}` : defaultUrl;

  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
};

export default SEO;
