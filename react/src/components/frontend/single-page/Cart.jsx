import React from 'react'
import { useCartContext } from '../../../contexts/CartContext'

const Cart = ({ product_id, product_color_id }) => {
  
  let cart = useCartContext();

  return (
    <div>
        <div className="add_quantity mb-3 col-12">
            <div className="input-group" style={{maxWidth:"130px", minWidth:"130px"}}>
                <span className="input-group-text btn btn-outline-primary" onClick={(e) => cart.handleQuantity('decrease')}><i className="bi bi-dash"></i></span>
                 <div className="form-control text-center border-start-0 border border-primary" >{cart.quantity}</div>
                <span className="input-group-text btn btn-outline-primary" onClick={(e) => cart.handleQuantity('increase')}><i className="bi bi-plus"></i></span>
            </div>
        </div>
        <div className="col-md-6 col-lg-4">
            <button type="button" className="btn btn-outline-primary mb-3" onClick={(e) => cart.addProductToCart(e, product_id, product_color_id)} style={{maxWidth:"130px", minWidth:"130px"}}>
                {
                    cart.cartAction ?
                    (
                    <><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    Adding...</>
                    )
                    :
                    (<div><i className="bi bi-cart-plus"></i> Add To Cart</div>)
                }
                
            </button>
        </div>
    </div>
  )
}

export default Cart