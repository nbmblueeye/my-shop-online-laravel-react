import React, {useEffect, useState} from 'react'
import HeadSlider from '../../../components/frontend/front-page/HeadSlider'
import Category from '../../../components/frontend/front-page/Category'
import axiosClient from '../../../axiosClient';
import Trending from '../../../components/frontend/front-page/Trending';
import NewArrival from '../../../components/frontend/front-page/NewArrival';
import Fearure from '../../../components/frontend/front-page/Fearure';
import { useNavigate } from 'react-router-dom';


const FrontPage = () => {

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
  }, []);

  const [sliders, setSliders] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendings, setTrendings] = useState([]);
  const [features, setFeatures] = useState([]);

  const [loading, setLoading] = useState();
   useEffect(() => {
      getIndex();
   }, []);

  const getIndex = async() => {
    setLoading(true);
    await axiosClient.get('/index')
    .then(res => {
        if(res && res.status == 200){
            setLoading(false);
            let { sliders, categories, newArrivals, trendings, features } =res.data;
            setSliders( sliders );
            setCategories( categories );
            setNewArrivals( newArrivals );
            setTrendings(trendings);
            setFeatures(features);
        }
    })
    .catch(err => {
        if(err){
            setLoading(false);
            if(err.response && err.response.status == 403){
              toast.fire({
                icon: 'error',
                text: err.response.data.message,
              });
              navigate('/login');
            }
            console.log(err);
        }
    })
  }
  
  return (
    <>
      <div className='my-online-shop-main-section-content'>
        <HeadSlider sliders={sliders} loading={loading}/>
        <div className="container">
          <Category categories={categories} loading={loading}/>
          <NewArrival newArrivals={newArrivals} loading={loading}/>
          <Trending trendings={trendings} loading={loading}/>
          <Fearure features={features} loading={loading}/>
        </div>
      </div>
    </>
  )
}

export default FrontPage