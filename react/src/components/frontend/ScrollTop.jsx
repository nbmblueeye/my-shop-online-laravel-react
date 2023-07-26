import React, { useRef, useState, useEffect } from 'react'

const ScrollTop = () => {

  const [activeScrollButton, setActiveScrollButton] = useState(false);
  const scrollButton = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', () => displayScrollButton());
  }, [])

  let displayScrollButton = () => {
      if(window.scrollY > 400){
        setActiveScrollButton(true);
      }else{
        setActiveScrollButton(false);
      }

  }

  const scrollToTop = (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  }

  

  return (
    <div className={`scroll-to-top-btn ${activeScrollButton ? "active":""}`} onClick={ (e) => scrollToTop(e)}>
        <span className='text-primary'><i className="bi bi-chevron-double-up"></i></span>
    </div>
  )
}

export default ScrollTop
