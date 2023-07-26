import React from 'react'
import { useWishlistContext } from '../../../contexts/WishlistContext'

const Wishlist = ( {product_id, product_color_id} ) => {

  let wishlist = useWishlistContext();

  return (
    <div>
        <div className="col-md-6 col-lg-4">
          <button type="button" className="btn btn-outline-success woocommerce-product-add-to-btn" onClick={(e) =>  wishlist.addNewWishlist( e, product_id, product_color_id )} style={{maxWidth:"160px", minWidth:"160px"}}>             
              {
                  wishlist.wishlistAction ?
                  (
                  <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    Adding...</>
                  )
                  :
                  (<div><i className="bi bi-heart-fill"></i> Add To Wishlist</div>)
              }
          </button>
        </div>
    </div>
  )
}

export default Wishlist
