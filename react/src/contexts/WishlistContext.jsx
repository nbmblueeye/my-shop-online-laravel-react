import React, { createContext, useContext, useState } from 'react'
import axiosClient from '../axiosClient';

  const Wishlist_Context = createContext({
    wishlistAction:false,
    addNewWishlist:()=>{},
    show:false,
    handleModal:()=>{},
  });

  export const useWishlistContext = () => {
    return useContext(Wishlist_Context);
  }

const WishlistContext = ( {children} ) => {

  const [wishlistAction, setWishlistAction] = useState(false);
  const [wishList, setWishlistList] = useState([]);

  const addNewWishlist = async(e, product_id, product_color_id) => {
    e.preventDefault();
    setWishlistAction(true);
    let wishlist_data = new FormData();
    wishlist_data.append("product_id", product_id);
    wishlist_data.append("product_color_id", product_color_id);
    await axiosClient.post('/wishlist/add', wishlist_data)
    .then(res => {
      if(res){
        if(res.status == 201){
          setWishlistAction(false);
          toast.fire({
            icon: 'success',
            text: res.data.feedback,
          });
        }
      }
    })
    .catch(err => {
      if(err){
        setWishlistAction(false);
        console.log(err);
        if(err.response.status == 401){
          toast.fire({
            icon: 'error',
            text: err.response.data.message,
          });
          navigated('/login');
        }else if(err.response.status == 404){
          toast.fire({
            icon: 'error',
            text: err.response.data.feedback,
          })
        }else if(err.response.status == 405){
          toast.fire({
            icon: 'error',
            text: err.response.data.feedback,
          })
        }else if(err.response.status == 406){
          toast.fire({
            icon: 'error',
            text: err.response.data.feedback,
          })
        }
      }
    })

  }

  let data = {
    wishlistAction,
    addNewWishlist,
  }

  return (
    <Wishlist_Context.Provider value={data}>
        { children }
    </Wishlist_Context.Provider>
  )
}

export default WishlistContext
