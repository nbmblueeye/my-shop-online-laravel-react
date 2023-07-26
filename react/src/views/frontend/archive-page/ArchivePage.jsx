import React, { useState ,useEffect, useRef } from 'react';
import axiosClient from '../../../axiosClient';

import Category from '../../../components/frontend/archive-page/Category';
import Brand from '../../../components/frontend/archive-page/Brand';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import SEO from '../../../components/frontend/SEO';

const ArchivePage = () => {
    
    const [categories, setCategories] = useState([]); 
    const [brands, setBrands] = useState({});
    const [loading, setLoading] = useState();
  
    const cateRefs = useRef([]);
    const scrollToCategory = (activeId) => {

        cateRefs.current.map((item, index) => {
            if(index == activeId){
                window.scrollTo({
                    top: item.offsetTop - 50,
                    behavior: 'smooth',
                });
            }
        });
        
    } 

    useEffect(() => {
        getArchive();
    }, []);

    const getArchive = async() => {
        setLoading(true);
        await axiosClient.get('/archive')
        .then(res => {
            if(res && res.status == 200){
                let { brands, categories }  = res.data
                setLoading(false);
                setBrands(brands);
                setCategories(categories);
            }
        })
        .catch(err => {
            if(err){
                setLoading(false);
                console.log(err);
            }
        })
    }

  return (
    <>
        <MainLayout>
            <SEO title="All Category" metaKeywords="My Online Shop" metaDes="My Online Shop"/>
            <Category categories={ categories } loading={loading} cateRefs={cateRefs} scrollToCategory = {scrollToCategory}/>
            <Brand categories={ categories } brands = { brands } loading={loading} cateRefs={cateRefs}/>
        </MainLayout>
    </>
  )
}

export default ArchivePage
