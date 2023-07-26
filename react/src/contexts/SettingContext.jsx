import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../axiosClient';

const createSettingContext = createContext({
    settings:{},
    setSettings:()=>{},
    setRefresh:()=>{},
    loading:false,
    setLoading:()=>{},
})

export const useSettingContext = () => {
    return useContext(createSettingContext);
}

const SettingContext = ( { children } ) => {

    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        websiteName:"",
        websiteUrl:"",
        websiteDescription:"",
        pageTitle:"",
        metaKeywords:"",
        metaDes:"",
        address:"",
        phoneNo1:"",
        phoneNo2:"",
        emailNo1:"",
        emailNo2:"",
        facebook:"",
        twitter:"",
        instagram:"",
        youtube:"",
    });

    useEffect(() => {
        getSetting();
        return () => {
            setRefresh(false); 
        }
    }, [refresh])

    const getSetting = async() => {
        setLoading(true);
        await axiosClient.get('/admin/settings')
        .then(res => {
            setLoading(false);
            if(res && res.status == 200){
                let { setting } = res.data;
                setSettings({...settings, ...setting});
            } 
        })
        .catch(err => {
            setLoading(false);
            if(err){
              console.log(err);
            }
        });
    }
    
  return (
    <createSettingContext.Provider value={{settings, setSettings, setRefresh, loading}}>
        {children}
    </createSettingContext.Provider>
  )
}

export default SettingContext
