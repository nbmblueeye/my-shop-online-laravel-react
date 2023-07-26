import React from 'react';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import SEO from '../../../components/frontend/SEO';

const Blogs = () => {
  return (
    <MainLayout>
      <SEO title="Blogs" metaKeywords="" metaDes=""/>
      <div className="my-online-shop-section blogs-page shadow">
          <div className="pb-5 px-3">
              <h5>Blogs Page</h5>
          </div>
      </div>
    </MainLayout>
  )
}

export default Blogs