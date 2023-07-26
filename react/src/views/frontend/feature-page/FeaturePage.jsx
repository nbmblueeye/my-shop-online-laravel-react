import React, { useEffect, useState, } from 'react';
import { useSearchParams } from 'react-router-dom';

import MainLayout from '../../../components/frontend/layout/MainLayout'
import FilterBrand from '../../../components/frontend/category-page/FilterBrand'
import Product from '../../../components/frontend/Product';
import axiosClient from '../../../axiosClient';
import SEO from '../../../components/frontend/SEO';

const FeaturePage = () => {

    const [loading, setLoading] = useState();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        getFeatureProduct();
        setSearchParams(filters); 
    }, [filters]);

    const getFeatureProduct = async() => {
        setLoading(true);
        await axiosClient.get('/feature-products',{params:filters})
        .then(res => {
            if(res && res.status == 200){
                setLoading(false);
                const { products, categories, brands } = res.data;
                setCategories(categories);
                setBrands(brands);
                setProducts(products);
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
          <div className="card w-100 border-0 p-3">
            <div className="card-body">
                {
                  products.length > 0 ?
                  ( 
                    <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4'>
                        {products.map((product, index) => <Product key={index} product = {product}/>)}
                    </div>
                  )
                  :
                  (
                    <div className="d-flex justify-content-center w-100 py-5">  
                        <div className="text-primary"> 
                            <h5>There are No Product Available</h5>
                        </div> 
                    </div> 
                  )
                }
            </div>   
          </div>
        )
    }

  return (
    <MainLayout>
        <SEO title="Feature Product" metaKeywords="My Online Shop" metaDes="My Online Shop"/>
        <div className="row">
            <div className="col-sm-3">
                <FilterBrand categories={categories} brands={brands} setFilters = {setFilters}/>
            </div>
            <div className="col-sm-9">
                <div className="my-online-shop-section">
                    {
                        output
                    }
                </div>
            </div>
        </div> 
    </MainLayout>
  )
}

export default FeaturePage
