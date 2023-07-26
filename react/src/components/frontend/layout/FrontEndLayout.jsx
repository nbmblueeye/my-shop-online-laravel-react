import React from 'react';
import { Outlet } from 'react-router-dom';
import HeadBar from './HeadBar';
import Footer from './Footer';
import WishlistContext from '../../../contexts/WishlistContext';
import CartContext from '../../../contexts/CartContext';

const FrontEndLayout = () => {
  return (
    <div className='my-online-shop-main-section'>
        <WishlistContext>
          <CartContext>
              <HeadBar/>
              <Outlet/>
              <Footer/>
          </CartContext>
        </WishlistContext>
    </div>
  )
}

export default FrontEndLayout