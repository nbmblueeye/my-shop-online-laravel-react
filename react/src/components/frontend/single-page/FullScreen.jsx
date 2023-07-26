import React, { useEffect, useRef } from 'react';
// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';
// import styles bundle
import 'swiper/css/bundle';

const FullScreen = ( { modal, _setModal, image_gallaries, createImage  } ) => {

    const fullScreenSliderSwiperRef = useRef();
    const fullscreenSwiperButtonNext = useRef();
    const fullscreenSwiperButtonPrev = useRef();
    const fullscreenSwiperButtonPag = useRef();
    
    useEffect(() => {
        var swiper = new Swiper(fullScreenSliderSwiperRef.current, {
            navigation: {
              nextEl: fullscreenSwiperButtonNext.current,
              prevEl: fullscreenSwiperButtonPrev.current,
            },
            pagination: {
                el: fullscreenSwiperButtonPag.current,
              },
            });
    }, [])

  return (
    <>
        <div id="fullScreenSlider" className={`slider ${modal ? "show":""}`}>
            <div className="slider-content">
                <span className="slider-close-btn" onClick={(e) => _setModal(e)}><i className="bi bi-x"></i></span>
                <div className="swiper fullScreenSliderSwiper" ref={fullScreenSliderSwiperRef}>
                    <div className="swiper-wrapper">
                        {
                            image_gallaries.length > 0 ?
                            image_gallaries.map((image, index) => 
                                <div className="swiper-slide" key={index}>
                                    <img src={createImage(image.url)} />
                                </div>
                            )
                            :
                            <div className="swiper-slide" key={index}>
                                <img src={createImage("")} />
                            </div>
                        }
                    </div>
                    <div className="swiper-button-next gallary swiper-navigate-button " ref={fullscreenSwiperButtonNext}></div>
                    <div className="swiper-button-prev gallary swiper-navigate-button" ref={fullscreenSwiperButtonPrev}></div>
                    <div className="swiper-pagination swiper-pagination-fullscreen" ref={fullscreenSwiperButtonPag}></div>
                </div>
            </div>
        </div>
    </>
  )
}

export default FullScreen
