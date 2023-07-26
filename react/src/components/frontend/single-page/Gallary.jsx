import React, { useRef, useState , useEffect, useMemo} from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';
// import styles bundle
import 'swiper/css/bundle';

import FullScreen from "./FullScreen";


const Gallary = ( { image_gallaries }) => {

    const mainSlideRef = useRef();
    const thumbSlideRef = useRef();
    const sliderBoxRef = useRef();
    const nextRef = useRef();
    const prevRef = useRef();

    const lensRef = useRef();
    const [display, setDisplay] = useState(false);

    const [imageSize, setImageSize] = useState({});
    const [lensSize, setLensSize] = useState({});

    const [resultPos, setResultPos] = useState({});
    const [lens, setLens] = useState({
        left:50 + "px",
        top:50 + "px",
        width:40 + "px",
        height:40 + "px",
    });

    const [activeSlide, setActiveSlide] = useState(0);

    const[modal, setModal] = useState(false);
    const _setModal = (e) => {
        e.preventDefault();
        setModal(() => !modal);
        if(!document.body.classList.contains("stopScroll")){
            document.body.classList.add("stopScroll");
        }else{
            document.body.classList.remove("stopScroll");
        }
    }

    useEffect(() => {
        var swiper = new Swiper(thumbSlideRef.current, {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
          });

        var swiper2 = new Swiper(mainSlideRef.current, {
            spaceBetween: 30,
            navigation: {
              nextEl: nextRef.current,
              prevEl: prevRef.current,
            },
            thumbs: {
              swiper: swiper,
            },
          });

          swiper2.on('slideChange', function () {
            setActiveSlide(swiper2.realIndex);
          });
    }, [])


    const createImage = (image) => {
        let photo = "";
        if(image){
            if(image.indexOf('base64') !== -1){
                photo = image
            }else{
                photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/products/gallarys/` + image;
            }
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
        }
        return photo;
    };

    const mousePosition = (e) => {
        let a = sliderBoxRef.current.getBoundingClientRect();
        setImageSize({width: a.width, height:a.height});
        setLensSize({width: lensRef.current.offsetWidth, height:lensRef.current.offsetHeight});
        let x = e.pageX - a.left - window.pageXOffset;
        let y = e.pageY - a.top - window.pageYOffset;
        return {x: x, y: y};
    }

    const mouseMove = (e) => {
        e.preventDefault();
        let mouse = mousePosition(e);

        let lensX = mouse.x - lensSize.width/2;
        let lensY = mouse.y - lensSize.height/2;

         /* Prevent the lens from being positioned outside the image: */
        if (lensX > imageSize.width - lensSize.width - 15) {lensX = imageSize.width - lensSize.width - 15;}
        if (lensX < 15) {lensX = 15;}
        if (lensY > imageSize.height - lensSize.height - 15) {lensY = imageSize.height - lensSize.height - 15;}
        if (lensY < 15) {lensY = 15;}

        setLens({...lens,left:lensX + "px", top:lensY + "px"});
        setResultPos({x:lensX, y:lensY});
    }

    const mouseEnter = (e) => {
        e.preventDefault();
        setDisplay(true); 
    }

    const mouseLeave = (e) => {
        e.preventDefault();
        setDisplay(false);
    }

    const setResult = () => {
       
        let cx = imageSize.width/lensSize.width;
        let cy = imageSize.height/lensSize.height;

        let activeImg = image_gallaries.filter((image, index) => index == activeSlide);
       
        let activeImage = {
            backgroundImage: `url(${createImage(activeImg[0].url)})`,
            backgroundSize: (imageSize.width * cx) + "px " + (imageSize.height * cy) + "px",
            backgroundPositionX: `${-cx * resultPos.x + lensSize.width/2}px`,
            backgroundPositionY: `${-cx * resultPos.y + lensSize.height/2}px`,
            backgroundRepeat: 'no-repeat',
        }

        return activeImage;
    }

    let zoomImageResult = useMemo(() => setResult(), [lens]);

    // const resizeLens = (e) => {
        
    //     let zoom = e.deltaY;
    //     let W = 0;
    //     let H = 0;
    //     if(zoom > 0){
    //         W = parseInt(lensSize.width) + 2;
    //         H = parseInt(lensSize.height) + 2;
           
    //     }else if(zoom < 0){
    //         W = parseInt(lensSize.width) - 2;
    //         H = parseInt(lensSize.height) - 2;   
    //     }
    //     setLens({...lens,width:W + "px", height:H + "px"});
    // }

    return (
        <div className='single_product_image_gallary_screen'>
            <div className="single_product_image_gallary_full_screen_btn" onClick={(e) => _setModal(e)}>
                <OverlayTrigger
                        placement='top'
                        overlay={
                          <Tooltip id={`tooltip-top`}>
                            View Full
                          </Tooltip>
                        }
                    >
                      <span className='text-success'>
                      <i className="bi bi-fullscreen"></i>
                      </span>
                </OverlayTrigger>
            </div>
            <div className="single_product_image_gallary_box border" ref={sliderBoxRef} onMouseMove={(e) => mouseMove(e)} onMouseEnter={(e) => mouseEnter(e)} onMouseLeave={(e) => mouseLeave(e)}>
                <div className="swiper singleProductGallary2" ref={mainSlideRef} >
                    <div className="swiper-wrapper"> 
                        {
                            image_gallaries.length > 0 ?
                            image_gallaries.map((image, index) => 
                                <div className="swiper-slide" key={index}>
                                    <img src={createImage(image.url)}/>
                                </div>
                            )
                            :
                            <div className="swiper-slide">
                                <img src={createImage("")}/>
                            </div>
                        }
                    </div>
                   
                </div> 
                <div className="swiper-button-next gallary swiper-navigate-button " ref={nextRef}></div>
                <div className="swiper-button-prev gallary swiper-navigate-button" ref={prevRef}></div>

                <div className={`single_product_image_gallary_zoom ${display ? "active":""}`} style={zoomImageResult}></div>
                <div className={`single_product_image_gallary_lens ${display ? "active":""}`} ref={lensRef} style={lens}></div>
            </div> 
            <div className="swiper singleProductGallary" ref={thumbSlideRef}>
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
            </div>
            <FullScreen modal={modal} _setModal={_setModal} image_gallaries={image_gallaries} createImage={createImage}/>
        </div>
    )

}

export default Gallary