import React, { Fragment, useEffect, useState } from  'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import axiosClient from '../../../axiosClient';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


const WishlistPage = () => {

    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const navigated = useNavigate();

    useEffect(() => {  
        if(!localStorage.getItem('ACCESS_TOKEN')){
            toast.fire({
                icon: 'warning',
                text: "Please login to view your Wishlist",
            });
            navigated('/login');
        }else{
            getWishlists();
        }
    }, [refresh]);

    const getWishlists = async() => {
        setLoading(true);
        await axiosClient.get('/wishlists')
        .then(res => {
            if(res && res.status == 201){
                setLoading(false);
                setWishlists(res.data.wishlists);
            }
        })
        .catch(err => {
            if(err){
                setLoading(false);
                console.log(err);
            }
        })
    }

    const deleteWishlist = (e, id) => {
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
            axiosClient.get(`/wishlist/delete/${id}`)
            .then(res => {
                if(res){
                  if(res.status == 204){
                      setDeleting('');
                      setRefresh(true);
                      Swal.fire(
                        'Deleted!',
                         'Selected Wishlist was deleted!',
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
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
        }
        return photo;
       
    };

    let output = "";
    if(loading){
        output = (
            <tr>
                <td colSpan="3">
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }else{
       output = (<>
                {
                   wishlists.length > 0 ?
                   wishlists.map((wishlist, index) =>
                    <tr key={index}>          
                        <td className='align-middle'>
                            <img src={createImage(wishlist.product.product_image.image_thumbnail)} alt="product_thumbnail" style={{width: '50px'}}/>
                        </td>
                        <td className='align-middle text-center'>
                            {
                                wishlist.product.sell_price ? 
                                <p className='mb-0'>${wishlist.product.sell_price} <span className='text-decoration-line-through mb-0 text-mute'>${wishlist.product.price}</span></p>
                                :
                                <p className='mb-0'>${wishlist.product.price}</p>
                            }
                        </td>  
                        <td className='align-middle'>
                            <button className="delete btn btn-outline-danger" onClick={(e) => deleteWishlist(e, wishlist.id)}>
                                <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                    Delete Wishlist
                                    </Tooltip>
                                }
                            >
                                {
                                    deleting == wishlist.id ? 
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
                            </button>
                        </td>                  
                    </tr>
                   
                    )
                    :
                    <tr>
                        <td colSpan="3"><div className="py-5 text-center">There're no Wishlist were selected...</div></td>
                    </tr>   
                } 
            </>    
       )
    }  
   
  return (
    <MainLayout>
        <div className="my-online-shop-section">
            <div className="card shadow card-box">
                <h5 className="card-header p-3">Your Wishlist</h5>
                <div className="card-body table-responsive p-md-5">
                    <table className="table table-bordered align-middle text-center table-bordered">
                        <thead className="table-light table-sm">
                            <tr>
                                <th scope="col">Product Image</th>
                                <th scope="col">Product Price <span>($)</span></th>
                                <th scope="col">Action</th>
                            </tr> 
                        </thead>
                        <tbody>
                            {
                            output
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </MainLayout>
  )
}

export default WishlistPage