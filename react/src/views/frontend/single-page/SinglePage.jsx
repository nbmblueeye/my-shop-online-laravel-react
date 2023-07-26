import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import axiosClient from '../../../axiosClient';
import Gallary from '../../../components/frontend/single-page/Gallary';
import Detail from '../../../components/frontend/single-page/Detail';
import Related from '../../../components/frontend/single-page/Related';
import Interaction from '../../../components/frontend/single-page/Interaction/Interaction';
import BreadCrumb from '../../../components/frontend/BreadCrumb';
import SEO from '../../../components/frontend/SEO';

const SinglePage = () => {

    let params = useParams();
    const [loading, setLoading] = useState();
    const [product, setProduct] = useState('');
    const [related_products, setRelated_products] = useState([]);
    const [error, setError] = useState("");
    let locations = useLocation();
    let activeViewRef = useRef(null);
    
    useEffect(() => {
        getSingle(); 
    },[params.id]);
    
    const getSingle = async() => {
        setLoading(true);  
        await axiosClient.get(`/${params.category}/${params.brand}/${params.id}`)
        .then(res => {
          if(res && res.status == 200){
              setLoading(false);
              setProduct(res.data.product);
              setRelated_products(res.data.related_products);
              window.scrollTo({
                top: activeViewRef.current.offsetTop,
                behavior: 'smooth',
            });
          }
        })
        .catch(err => {
            if(err){
                setLoading(false);
                if(err && err.response.status == 404){
                  setError(err.response.data.error);
                }
                console.log(err);
            }
        })
    }

    let output = '';
    if(loading){
        output = (
            <div className="d-flex justify-content-center w-100 py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }else{
        output = (
          !error ? 
            <>   
                {
                  product ?
                  ( 
                    <>
                        <div className="my-online-shop-section product_detail_information shadow p-3">
                            <div className="col-12">
                                <div className="row g-3">
                                    <div className="col-md-5">
                                        <Gallary image_gallaries={product.product_image.image_gallary ? JSON.parse(product.product_image.image_gallary):[] }/>
                                    </div>
                                    <div className="col-md-7">
                                        <Detail product={product}/>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div className="my-online-shop-section product_information shadow">                  
                            <Interaction product_id={product.id} product_description={product.description}/>                   
                        </div>
                        <div className="my-online-shop-section product_related">                   
                            <Related related_products={related_products}/>                
                        </div>
                    </>
                  )
                  :
                  (
                    <div className="d-flex justify-content-center w-100 py-5">  
                        <h5>There are No Product Available</h5>
                    </div> 
                  )
                }
            </>   
          :
          (
            <div className="card w-100 border-0 p-3 my-online-shop-section">
              <div className="d-flex justify-content-center w-100 py-5">  
                  <h5>{error}</h5>
              </div> 
            </div>
          )
        )
    }

    return (
        <div className="my-online-shop-main-section-content" ref={activeViewRef}>
            <div className="container">
                <SEO title={product.meta_title} metaKeywords={product.meta_keyword} metaDes={product.meta_description}/>
                <BreadCrumb locations={locations}/>
                {output}          
            </div>
        </div>
    )
}

export default SinglePage
