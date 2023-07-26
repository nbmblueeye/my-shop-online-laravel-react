import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({title, metaKeywords, metaDes}) => {

  return (
    <>     
      <Helmet>
        <title>{title}</title>
        <meta name="keywords" content={metaKeywords}/>
        <meta name="description" content={metaDes}/>
      </Helmet>
    </>
  )
}

export default SEO