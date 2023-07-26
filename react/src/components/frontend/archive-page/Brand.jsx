import React, { useState ,useEffect, useMemo } from 'react';
import axiosClient from '../../../axiosClient';
import Card from './Card';

const Brand = ( {categories, brands, loading, cateRefs} ) => {

   const categorizeBrands = (inputs) => {
        let cates = {};
        let arr = [];
        for (let i = 0; i < categories.length; i++) {
            for(let j = 0; j < brands.length; j++){
                if(categories[i].id == brands[j].category_id){  
                    arr.push(brands[j])  
                }
            }
            cates[categories[i].name] = arr;
            arr = [];
        }
        return cates;
    }

    const new_brands = useMemo(() => categorizeBrands(), [categories, brands])

    let output = "";
    if(loading){
         output = (
            <div className="card w-100 shadow my-online-shop-section brands">
                <div className="card-body">
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
             </div>
         )
    }else{
        output = (
            categories.length > 0 ?
            categories.map((category, index) =>
                <div className="my-online-shop-section card w-100" key={index} ref={(e) => cateRefs.current[category.id] = e}>
                     <div className="card-body">
                        <h5 className="section-title text-success mb-4">{category.name}</h5>
                        {
                            new_brands[category.name].length > 0 ?
                            <div className="row row-cols-1 row-cols-md-4 g-4">
                                {
                                    new_brands[category.name].map((brand, index) => 
                                        <Card brand={brand} key={index}/>
                                    )
                                }
                            </div>
                            :
                            <div className="d-flex justify-content-center py-5">
                                <div className="text-primary">
                                    <h5>There're no {category.name} Available</h5>
                                </div>
                            </div>
                        }
                            
                    </div>   
                </div>
            )
            :  
            <div className="card w-100"> 
                <div className="card-body">
                    <div className="d-flex justify-content-center py-5">
                        <div className="text-primary">
                            <h5>There're no Brand Available</h5>
                        </div>
                    </div>
                </div>
            </div>           
        )
    }  


  return (
    <div className='brands'>
        {output}
    </div>
  )
}

export default Brand