import React, { useEffect, useState, useRef} from 'react';
import { useParams,useSearchParams } from 'react-router-dom';
import axiosClient from '../../../axiosClient';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import FilterBrand from '../../../components/frontend/category-page/FilterBrand';
import Product from '../../../components/frontend/Product';
import SEO from '../../../components/frontend/SEO';

const BrandPage = () => {
  
    const [loading, setLoading] = useState();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    let params = useParams();
    let isMounted = useRef(false);

    useEffect(() => {
      getBrands();

      if(isMounted.current){
        setSearchParams(filters);
      }else{
        isMounted.current = true;
      }

    }, [filters]);

    const getBrands = async() => {
        setLoading(true);  
        await axiosClient.get(`/brand/${params.brand}`,{params:filters})
        .then(res => {
            if(res && res.status == 200){
                setLoading(false);
                const { category, products } = res.data;
                setCategory(category);
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
          !error ? 
          <div className="card w-100 border-0 p-3 my-online-shop-section">
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
                        <h5>There are No Product Available</h5>
                    </div> 
                  )
                }
            </div>   
          </div>
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
    <MainLayout>
        <SEO title={category.meta_title} metaKeywords={category.meta_keyword} metaDes={category.meta_description}/>
        <div className="row">
          <div className="col-sm-3">
            <FilterBrand categories={categories} brands={brands} setFilters = {setFilters}/>
          </div>
          <div className="col-sm-9">
              {
                output
              }
          </div>
        </div> 
    </MainLayout>
  )
}

export default BrandPage