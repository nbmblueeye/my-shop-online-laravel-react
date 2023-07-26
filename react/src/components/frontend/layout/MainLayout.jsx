import React, { useEffect, useRef} from 'react';
import BreadCrumb from '../BreadCrumb';
import { useLocation } from 'react-router-dom';

const MainLayout = ( {children} ) => {

  let locations = useLocation();
  let activeViewRef = useRef(null);

  useEffect(() => {
    window.scrollTo({
      top: activeViewRef.current.offsetTop,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="my-online-shop-main-section-content" ref={activeViewRef}>
      <div className="container">
        <BreadCrumb locations={locations}/>
        {children}
      </div>
    </div>
  )
}

export default MainLayout