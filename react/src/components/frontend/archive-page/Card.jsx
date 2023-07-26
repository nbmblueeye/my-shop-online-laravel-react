import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from 'react-router-dom';


const Card = ( { brand } ) => {

  const createImage = (image) => {
      let photo = "";
      if(image){
          if(image.indexOf('base64') !== -1){
              photo = image
          }else{
              photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/brands/` + image;
          }
      }else{
          photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
      }
      return photo;
  };

  return ( 
    <div className="col">
        <div className="card card-box shadow">
          <Link to={`/${brand.category.slug}/${brand.slug}`}>
            <div className="card_container">
                <img src={`${createImage(brand.image)}`} className="card-img-top" alt="brand-img"/>
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
            </div>
            <div className="card-body">
                <h5 className="brand-title text-success">{brand.name}</h5>
            </div>
          </Link>
        </div>
    </div> 
  )
}

export default Card



                         
                        