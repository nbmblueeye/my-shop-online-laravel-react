import React,{ useState ,useEffect, useRef} from 'react'
import axiosClient from '../../../axiosClient';
 // import Swiper bundle with all modules installed
 import Swiper from 'swiper/bundle';
 // import styles bundle
 import 'swiper/css/bundle';

const HeadSlider = (  { sliders, loading }  ) => {

    const headSliderRef = useRef();
    const nextBtnRef = useRef();
    const prevBtnRef = useRef();
    const pagBtnRef = useRef();

    useEffect(() => {
        var swiper = new Swiper(headSliderRef.current, {
            speed: 2500,
            spaceBetween: 0,
            loop:true,
            effect: "fade",
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            parallax: true,
            
            pagination: {
              el: pagBtnRef.current,
              clickable: true,
            },
            navigation: {
              nextEl: nextBtnRef.current,
              prevEl: prevBtnRef.current,
            },
        });
    }, [sliders])  

   const createImage = (image) => {
    let photo = "";
    if(image){
        if(image.indexOf('base64') !== -1){
            photo = image
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/headsliders/` + image;
        }
    }else{
        photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
    }
    return photo;
  };

   let output = "";
   if(loading){
        output = (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
   }else{
       output = (
           <>
              {
                sliders.length > 0 ? 
                <div className="my-online-shop-swiper-screen head-slider">
                    <div className="swiper myheadSliderSwiper" ref={headSliderRef}>
                        <div className="swiper-wrapper">
                            { 
                                sliders.map((slider, index) =>
                                <div className="swiper-slide" key={index}>
                                
                                    <img src={`${createImage(slider.image)}`} alt="head-slider-img" className="parallax-bg" data-swiper-parallax="0%" />
                                    <div className="content">
                                        <div className="title" data-swiper-parallax="-200">{slider.title}</div>
                                        <div className="subtitle" data-swiper-parallax="-400" dangerouslySetInnerHTML={{ __html: `${slider.sub_title}` }}/>
                                        <div className="text" data-swiper-parallax="-800">
                                            <p>
                                               {slider.message}
                                            </p>
                                        </div>
                                    </div>

                                </div>)
                            }
                        </div>
                        <div className="swiper-button-next swiper-navigate-button" ref={nextBtnRef}></div>
                        <div className="swiper-button-prev swiper-navigate-button" ref={prevBtnRef}></div>
                        <div className="swiper-pagination" ref={pagBtnRef}></div>    
                    </div>
                </div>
                :
                <div className="my-online-shop-no-slider">
                    <div className="d-flex justify-content-center align-items-center mx-auto h-100">
                        <div className="text-primary">
                            <h5>There're no Slider Available</h5>
                        </div>
                    </div>
                </div>
                   
              } 
           </>    
       )
   }  

  return (
    <div className='my-online-shop-section section-color'>
        {
            output
        }
    </div>
  )
}

export default HeadSlider
