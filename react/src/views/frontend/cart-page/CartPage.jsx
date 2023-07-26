import React, { useEffect, useState } from  'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import axiosClient from '../../../axiosClient';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useCartContext } from '../../../contexts/CartContext';


const CartPage = () => {

    const navigated = useNavigate();

    const {carts, setCarts, setRefresh, loading, totalCost } = useCartContext();
   
    const [updating, setUpdating] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if(!localStorage.getItem('ACCESS_TOKEN')){
            toast.fire({
              icon: 'warning',
              text: "Please login to view your Cart",
            });
            navigated('/login');
        }
    }, []);

    const decUpdateQuantity = (e, id) => {
        e.preventDefault();
        console.log(carts);
        setCarts(carts.map((cart, index) =>{
          if(cart.id == id){
             if(cart.quantity > 1){
                return { ...cart, quantity: cart.quantity - 1}
             }else{
              return cart;
             }
          }else{
            return cart;
          }
        }))
      
    }

    const encUpdateQuantity = (e, id) => {
        e.preventDefault();
      
        setCarts(carts.map((cart, index) =>{
          if(cart.id == id){    
            if(cart.product_color_id){    
              if( cart.quantity < cart.product_color.product_color_qty ){
                return { ...cart, quantity: cart.quantity + 1}
              }else{
                return cart;
              }
              
            }else{
              if(cart.quantity < cart.product.quantity ){
                return { ...cart, quantity: cart.quantity + 1}
              }else{
                return cart;
              }
            }
          }else{
            return cart;
          }
        }))
      
    }

    const editCart = async(e, id, qty) => {
      e.preventDefault();
      setUpdating(true);
      let cartForm = new FormData();
      cartForm.append('quantity', qty);
  
      await axiosClient.post(`/cart/edit/${id}`, cartForm)
      .then(res => {
         if(res){
             if(res.status == 202){
               setUpdating(false);
                toast.fire({
                    icon: 'success',
                    text: res.data.message,
                });
             }
            setTimeout(() => {
               setRefresh(true);
            }, 2000);
         }
       })
       .catch(err => {
           if(err){
              setUpdating(false);
               console.log(err);
           }
       })  
   }

   const deleteCart = (e, id) => {
    e.preventDefault();
    setDeleting(id);

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.get(`/cart/delete/${id}`)
        .then(res => {
            if(res){
              if(res.status == 204){
                  setDeleting('');
                  setRefresh(true);
                  Swal.fire(
                    'Deleted!',
                     'Selected product in Cart was deleted!',
                    'success'
                  )
              }
            }
        })
        .catch(err => {
          console.log(err);
        })
      }else{
        setDeleting('');
      }
    })
}
  const createImage = (image) => {
    let photo = "";
    if(image){
        if(image.indexOf('base64') !== -1){
            photo = image
        }else{
          photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/products/thumbnails/` + image;
        }
    }else{
        photo = "../uploads/no_img.jpg";
    }
    return photo;
  };

  let output = "";
  if(loading){
    output = (
      <tr>
          <td colSpan="6">
              <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                  </div>
              </div>
          </td>
      </tr>
    );
  }else{
    if(carts.length > 0){
        output = 
          (
            <>
            <React.Fragment>
              { 
                carts.map((cart,index) =>               
                <tr key={index}>
                  <td className="align-middle"><img src={createImage(cart.product.product_image.image_thumbnail)} alt="" style={{width: "60px"}}/></td>
                  <td className="align-middle">{cart.product.name}, {cart.product_color ? cart.product_color.color.name:""}</td>
                  <td className="align-middle">
                    {
                      cart.product.sell_price ? 
                        <div className='row mb-0'>
                            <p className='mb-0'>{cart.product.sell_price} <span className='text-decoration-line-through mb-0 text-mute'>{cart.product.price}</span></p>
                        </div>
                      :
                      (<p className='mb-0'>{cart.product.price}</p>)
                    }
                  </td>
                  <td className="align-middle"> 
                      <div className="input-group mx-auto" style={{maxWidth:"130px", minWidth:"130px"}}>
                        <span className="input-group-text btn btn-outline-primary" onClick={(e) => decUpdateQuantity(e, cart.id)}><i className="bi bi-dash"></i></span>
                          <div className="form-control text-center border-start-0 border-end-0 border border-primary" >{cart.quantity}</div>
                        <span className="input-group-text btn btn-outline-primary" onClick={(e) => encUpdateQuantity(e, cart.id)}><i className="bi bi-plus"></i></span>
                      </div>
                  </td>
                  <td className="align-middle">
                    {
                      cart.product.sell_price ? 
                      cart.product.sell_price * cart.quantity
                      :
                      cart.product.price * cart.quantity
                    }
                  </td>
                  <td className="align-middle">
                      <div className="edit btn btn-outline-warning" onClick={(e) => editCart(e, cart.id, cart.quantity)}>
                      <OverlayTrigger
                          placement='top'
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              Edit Category
                            </Tooltip>
                          }
                        >
                          {
                            updating == cart.id ? 
                            (
                              <div className="d-flex justify-content-center">
                                  <div className="spinner-border text-primary" role="status">
                                      <span className="visually-hidden">Updating...</span>
                                  </div>
                              </div>
                            )
                            : 
                            <i className="bi bi-pen-fill"></i>
                          }
                        </OverlayTrigger>  
                      </div>
                      &nbsp;&nbsp;
                      <div className="delete btn btn-outline-danger" onClick={(e) => deleteCart(e, cart.id)}>
                        <OverlayTrigger
                          placement='top'
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              Edit Category
                            </Tooltip>
                          }
                        >
                          {
                            deleting == cart.id ? 
                            (
                              <div className="d-flex justify-content-center">
                                  <div className="spinner-border text-primary" role="status">
                                      <span className="visually-hidden">Deleting...</span>
                                  </div>
                              </div>
                            )
                            :
                            <i className="bi bi-trash3-fill"></i>
                          }
                        </OverlayTrigger>  
                      </div>
                  </td>
                </tr>)
              }
            </React.Fragment>
            </>
          )
    }else{
        output = <tr><td colSpan="6"><div className="py-5 text-center">There're no Product In Cart...</div></td></tr>           
    }
  } 
   
  return (
     <MainLayout>
        <div className="my-online-shop-section">
          <div className="card shadow card-box">
            <h5 className="card-header p-3">Your Card</h5>
            <div className="card-body table-responsive p-md-5">
                <table className="table table-bordered align-middle text-center table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Price <span>($)</span></th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total Price <span>($)</span></th>
                      <th scope="col">Action</th>
                    </tr> 
                  </thead>
                  <tbody>
                    {
                      output
                    }
                    <tr className="border-0">
                      <td colSpan={4} className="border-0"></td>
                      <td className="border">{totalCost}</td>
                      <th className="border text-end">Total Price</th>
                    </tr>
                    <tr className="border-0">
                      <td colSpan={4} className="border-0"></td>
                      <th colSpan={2} className="text-center border"><Link to='/cart/checkout' className='btn btn-success w-100'>Check Out</Link></th>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>
        </div>
     </MainLayout>
  )
}

export default CartPage
