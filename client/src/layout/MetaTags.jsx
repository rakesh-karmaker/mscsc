import { Helmet } from "react-helmet-async";

const MetaTags = ({ title = "", description = "" }) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta
        name="keywords"
        content="math, science, biology, astronomy, IT, science club, club, mubc, mubcsc, mscsc, monipur high school and college science club, monipur high school and college club"
      />
      <meta name="description" content={description} />
      <meta name="og:site_name" content="MSCSC" />
      <meta name="subject" content="Science Club" />
      <link rel="canonical" href={window.location.href} />
      {/* Open Graph tags (OG) */}
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* OG image tags */}
      <meta property="og:image" content="/logo.webp" />
      <meta property="og:image:secure_url" content="/logo.webp" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="200" />
      <meta property="og:image:alt" content={`Image of ${title} site`} />
      {/* Twitter tags */}
      <meta name="twitter:creator" content="MSCSC" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default MetaTags;
