import React, { useState, useEffect } from 'react';
import Cart from './Cart';
import Wishlist from './Wishlist';

const Detail = ( { product } ) => {

  let [stock, setStock] = useState('');
  let [productColors, setProductColors] = useState([]);
  let [productColor, setProductColor] = useState(null);

  useEffect(() => {
    _setStock();
    _setProductColors();
  }, [productColor]);

  const _setProductColors = () => {
    if(product.product_color){
      setProductColors(product.product_color);
    }
  }

  const _setProductColor = (e, input) => {
      if(e.currentTarget.checked){
        setProductColor( input );
      }
  }

  const _setStock = () => {
    if(product){    
      if(productColor){
        if(productColor.product_color_qty > 0){
          setStock("In Stock");
        }else{
          setStock('Out Of Stock');
        }
      }else if(product.quantity > 0){
        setStock("In Stock");
      }else{
        setStock('Out Of Stock');
      }
    }
  }

  const createImage = (image) => {
    let photo = "";
    if(image){
        if(image.indexOf('base64') !== -1){
            photo = image
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/colors/` + image;
        }
    }else{
        photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
    }
    return photo;
  };

  return (
    <div className='single_product_detail_infomation'>
        <div className="header">
          <h4>{product.name}</h4>
          {stock == 'In Stock' ? 
            <div className="stock-sign bg-success text-white rounded" ><p>{stock}</p></div>
            :
            <div className="stock-sign bg-danger text-white rounded"><p>{stock}</p></div>
          }
        </div>
        <hr />
        <div className="body">
          <dl className="row">
            <dt className="col-sm-3">Product PN:</dt>
            <dd className="col-sm-9">A description list is perfect for defining terms.</dd>
            <dt className="col-sm-3">Price:</dt>
            <dd className="col-sm-9">
            {
              product.sell_price ? 
                <div className='row mb-0'>
                    <p className='mb-0'>${product.sell_price} <span className='text-decoration-line-through mb-0 text-mute'>${product.price}</span></p>
                </div>
                :
                (<p className='mb-0'>${product.price}</p>)
              
            }
            </dd>
            <dt className="col-12">Short Description:</dt>
            <dd className="col-12">{product.short_description}</dd>
              {
                productColors.length > 0 && (
                  <>
                    <dt className="col-12 mt-3">Product Color:</dt>
                    <div className="row">
                      <dd className="col-12 mt-3 ps-5">  
                      {
                        productColors.map((product_color, index) => (
                          <div className="col-md-3 mb-3 form-check form-check-inline" key={index} style={{minWidth:'100px'}}>
                              <input className="form-check-input" type="radio" name="product_color" id="color" onChange={(e) => _setProductColor(e, product_color)}/>
                              <label className="form-check-label" htmlFor="color">{product_color.color.name} <img style={{width:'30px'}} className="image_fluid" src={`${createImage(product_color.color.image)}`} alt="color_img" /></label>
                          </div> 
                        ))
                      }
                      </dd>
                    </div>
                  </>   
                )                      
              }
            
          </dl>
          <div className="add-to-cart">
            <div className="row">
                <Cart product_id={product.id} product_color_id={productColor ? productColor.id:""}/>
                <Wishlist product_id={product.id} product_color_id={productColor ? productColor.id:""}/>
            </div>
          </div>
        </div> 
    </div>
  )
}

export default Detail
