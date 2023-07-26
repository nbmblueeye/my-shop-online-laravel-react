import React, {useState, useEffect} from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../../../components/frontend/layout/MainLayout';
import Product from '../../../components/frontend/Product';
import axiosClient from '../../../axiosClient';
import LPagination from '../../../components/LPagination';

const SearchPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
   
    const [loading, setLoading] = useState();
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
      getSearchProduct();
    }, [searchParams]);

    const onPaginate = (url) => {
        getSearchProduct(url);
    }

    const getSearchProduct = async(link) => {
      setLoading(true);
      let url = link ? link:'/search'; 
      await axiosClient.get(url,{params:{s: searchParams.get('s')}})
      .then(res => {
        if(res && res.status == 200){
            setLoading(false);
            setError('');
            const { products } = res.data;
            setProducts(products.data);
            setItems(products);
            console.log(res.data);
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
        output = 
        <>
            {
                !error ?
                    products.length > 0 ?
                    ( 
                        <div className='row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4'>
                            {products.map((product, index) => <Product key={index} product = {product}/>)}
                        </div>
                    )
                    :
                    (
                        <div className="d-flex justify-content-center w-100 py-5">  
                            <h5>There are No Product Available</h5>
                        </div> 
                    )
                :
                (
                    <div className="d-flex justify-content-center w-100 py-5">  
                        <h5>{error}</h5>
                    </div> 
                )
            }   
        </>  
    }

  return (
      <MainLayout>        
        <div className="card w-100 border-0 p-3 my-online-shop-section">
            <div className="card-title">
                <h5 className="section-title text-success mb-4">Search Results</h5>
            </div>
            <div className="card-body pt-5">
                {
                    output
                }
            </div>   
            {
                items.total > items.per_page &&
                <div className="d-flex justify-content-center mt-5 me-5">
                    <LPagination items={items}  onPaginate={onPaginate}/> 
                </div>
            }
        </div>      
      </MainLayout>
  )
}

export default SearchPage