import React, { useState ,useEffect } from 'react';
import axiosClient from '../../../axiosClient';
import { Link } from 'react-router-dom';

const Category = ({ categories, loading }) => {

   const createImage = (image) => {
    let photo = "";
    if(image){
        if(image.indexOf('base64') !== -1){
            photo = image
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/categories/` + image;
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
                    categories.length > 0 ?
                        <div className="category_card_container" >
                            {
                                categories.map((category, index) =>
                                <div className="category_card_wrapper"  key={index}>
                                    <Link to={`/${category.slug}`}>
                                        <div className="category_card_box" >              
                                            <img src={createImage(category.image)} alt="..."/>
                                            <h5 className="card-title">{category.name}</h5>                                  
                                        </div>
                                    </Link>
                                </div>
                                )
                            }
                        </div>    
                    :
                    (
                        
                        <div className="d-flex justify-content-center py-5 mx-auto">
                            <div className="text-primary">
                                <h5>There're no Category Available</h5>
                            </div>
                        </div>
                          
                    )
                } 
            </>
       )
   }  
   
  return (
    <div className='my-online-shop-section front-page-category shadow'>
        {output}
    </div>
  )
}

export default Category