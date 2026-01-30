import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  type?: string;
  name?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "AutoMarketer AI - AI-Powered Marketing Automation Platform",
  keywords = "marketing, ai, automation, campaigns, analytics",
  type = "website",
  name = "AutoMarketer AI",
}) => {
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>
        {title} | {name}
      </title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
