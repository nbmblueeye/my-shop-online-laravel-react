import React, { useState, useEffect} from 'react'
import axiosClient from '../axiosClient';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/Auth/UserContext';

const AdminProtectRoute = () => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    let usecontext  = useUserContext();
    let navigate = useNavigate();

    useEffect(() => {
        initUserRole();
    }, [usecontext.token]);

    let initUserRole = async() => {
        setLoading(true);
        await axiosClient.get('/admin')
        .then(res => {
            if(res){
                setLoading(false);
                setIsAdmin(true)
            }
        })
        .catch(err => {
            if(err){
                setLoading(false);
                setIsAdmin(false);
                let { response} = err;
                if(response && response.status == 403){
                   
                    toast.fire({
                        icon: 'error',
                        text: response.data.error,
                    });
                    navigate('/home');

                }else if(response && response.status == 401){             
                    toast.fire({
                        icon: 'error',
                        text: response.data.message,
                    });
                    navigate('/login');
                }
            }
        })
    }

  return (
    <>
      {isAdmin && <Outlet/>}
    </>
  )
}

export default AdminProtectRoute
