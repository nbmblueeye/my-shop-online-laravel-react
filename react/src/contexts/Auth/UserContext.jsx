import React, { createContext, useContext, useState} from 'react';
import axiosClient from '../../axiosClient';
import {Navigate} from 'react-router-dom'

const userContext = createContext({
    token:null,
    _setToken:()=>{},
   user:{},
    _setUser:()=>{},
    userLogout:()=>{},
})

export const useUserContext = () => {
    return useContext(userContext)
}

const UserContext = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [user, setUser]   = useState({
        user_name:localStorage.getItem('ACCESS_USER'),
        url:localStorage.getItem('USER_URL'),
        role:localStorage.getItem('USER_ROLE'),
    });
   
    const _setToken = (token) => {
        setToken(token);
        if(token){
            localStorage.setItem('ACCESS_TOKEN', token);
        }else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    const _setUser = (data) => {  
        if(data){
            localStorage.setItem('ACCESS_USER', data.name);
            if(data.avatar){
                localStorage.setItem('USER_URL', data.avatar);
            }else{
                localStorage.removeItem('USER_URL');
            }
            localStorage.setItem('USER_ROLE', data.hasRole);
            setUser({...user,...{user_name:data.name, url:data.avatar, role:data.hasRole}});
        }else{
            localStorage.removeItem('ACCESS_USER');
            localStorage.removeItem('USER_URL');
            localStorage.removeItem('USER_ROLE');
            setUser({...user,...{user_name:null, url:null, role:null}});
        }
    };

    const userLogout = async(e) => {
        e.preventDefault();
        await axiosClient.get('/logout')
        .then(res => {
           if(res && res.status == 204){
             _setToken(null);
             _setUser(null);
             
             <Navigate to="/home"/>
             toast.fire({
               icon: 'warning',
               text: "You have been logged out!",
             });
           }
        })
     }

    let userData = {
        token,
        _setToken,
        user,
        _setUser,
        userLogout,
    }

  return (
    <userContext.Provider value={userData}>
        {
            children
        }
    </userContext.Provider>
  )
}

export default UserContext