import React from 'react'
import MainLayout from '../../../components/frontend/layout/MainLayout';
import SEO from '../../../components/frontend/SEO';

const AboutUs = () => {
  return (
    <MainLayout>
      <SEO title="About Us" metaKeywords="" metaDes=""/>
      <div className="my-online-shop-section about-us-page shadow">
          <div className="pb-5 px-3">
              <h5>About Us</h5>
          </div>
      </div>
    </MainLayout>
  )
}

export default AboutUs