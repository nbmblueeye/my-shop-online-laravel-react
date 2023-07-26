import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';
// import styles bundle
import 'swiper/css/bundle';

import ProductSwipe from '../ProductSwipe';

const NewArrival = ({ newArrivals, loading }) => {

    const newArrivalRef = useRef();
    const nextBtnRef = useRef();
    const prevBtnRef = useRef();
 
    useEffect(() => {
      var swiperArrival = new Swiper(newArrivalRef.current, {
        slidesPerView: 4,
        spaceBetween: 0,
        navigation: {
          nextEl: nextBtnRef.current,
          prevEl: prevBtnRef.current,
        },

        breakpoints: {
          "@0.00": {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          "@0.75": {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          "@1.00": {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          "@1.50": {
            slidesPerView: 4,
            spaceBetween: 0,
          },
        },
      });
    }, [newArrivals]);

   let output = '';
   if(loading){
     output = (
         <div className="d-flex justify-content-center w-100 py-5">
             <div className="spinner-border text-primary" role="status">
                 <span className="visually-hidden">Loading...</span>
             </div>
         </div>
     )
   }else{
       output = (
          <>
            {
              newArrivals.length > 0 ?
              ( 
                <div className="my-online-shop-swiper-screen newArrival">
                  <div className="swiper mynewArrivalSwiper" ref={newArrivalRef}>
                    <div className="swiper-wrapper">
                      {
                        newArrivals.map((newArrival, index) => <ProductSwipe key={index} product={newArrival}/> )
                      }
                    </div>

                    <div className="swiper-button-next swiper-navigate-button" ref={nextBtnRef}></div>
                    <div className="swiper-button-prev swiper-navigate-button" ref={prevBtnRef}></div>
        
                  </div>
                </div>
              )
              :
              (
                <div className="d-flex justify-content-center py-5 mx-auto">
                    <div className="text-primary">
                        <h5>There're no Product Available</h5>
                    </div>
                </div>
              )
            }
          </>   
       )
   }

  return (
    <div className='my-online-shop-section newArrival shadow'>
      <div className="card-section-title">
          <h5 className="section-title text-success mb-4">New Arrival Product</h5>
          <p className='view-more'><Link to="/new-arrivals" className="view-more-link">View More</Link><i className="bi bi-arrow-right fs-5 icon"></i></p> 
      </div>
      {
        output
      }
    </div>
  )
}

export default NewArrival