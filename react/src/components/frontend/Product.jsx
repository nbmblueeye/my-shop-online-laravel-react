import React from 'react';
import { Link } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Product = ({product}) => {

  const createImage = (image) => {
    let photo = "";
    if(image){
        if(image.indexOf('base64') !== -1){
            photo = image
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/products/thumbnails/` + image;
        }
    }else{
        photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
    }
    return photo;
  };

  return (
    <div className="col mb-3">
      <div className="card card-box shadow">
          <span className="badge rounded-pill bg-success badge-sign">
              In Stock
          </span>
          <div className="card_container" >
            <Link to={`/${product.category.slug}/${product.brand.slug}/${product.slug}/${product.id}`}>
              <img src={createImage(product.product_image.image_thumbnail)} className="card-img-top" alt="cat_img"/>
              <div className="card_overlay rounded">
                  <OverlayTrigger
                      placement='top'
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          View Detail
                        </Tooltip>
                      }
                  >
                    <span className='text-success'>
                      <i className="bi bi-eye-fill"></i>
                    </span>
                  </OverlayTrigger>
              </div> 
            </Link> 
          </div>            
          <div className="card-body">
              <p className="card-text"><small className="text-body-secondary">{product.category.name} | {product.brand.name}</small></p>
              <h5 className="card-title">{product.name}</h5>
              {
                product.sell_price ?     
                <p className="card-text">${product.sell_price} <span className='text-decoration-line-through mb-0 text-mute'>${product.price}</span></p>
                :
                <p className="card-text">${product.price}</p>
              }
          </div>
      </div>
    </div>
  )
}

export default Product
