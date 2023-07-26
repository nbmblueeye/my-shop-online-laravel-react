import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axiosClient from '../../../axiosClient';
import Pagination from '../../../components/Pagination';


const SliderIndex = () => {

    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [refresh, setRefresh] = useState(false);
  
    const [postperpage] =  useState(6);
    const [currentNumber, setCurrentNumber] = useState(1);
    const paginate = (current) => {
      setCurrentNumber(current);
    }

    useEffect(() => {
        initSliders();
        return () => {
          setRefresh(false);
        }
      }, [refresh]);
    
    const initSliders = async() => {
        setLoading(true);
        await axiosClient.get('/admin/sliders')
        .then(res => {
        if(res && res.status == 201){
            setLoading(false);
            setSliders(res.data.sliders);
        }
        })
        .catch(err => {
            if(err){
            setLoading(false);
            console.log(err);
            }
        })
    }

    const createImage = (image) => {
        let photo = "";
        if(image){
            if(image.indexOf('base64') !== -1){
                photo = image
            }else{
                photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/headsliders/` + image;
            }
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
        }
        return photo;
    };
    
    const deleteSlider = (e, id) => {
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
            axiosClient.get(`/admin/delete/slider/${id}`)
            .then(res => {
                if(res){
                  if(res.status == 204){
                      setDeleting('');
                      setRefresh(true);
                      Swal.fire(
                        'Deleted!',
                         'Selected Slider was deleted!',
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

    let output = "";
    if(loading){
      output = (
        <tr className='mt-5'>
            <td colSpan="7">
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </td>
        </tr>
      );
    }else{
      if(sliders.length > 0){
        let lastPost  = currentNumber * postperpage;
        let firstPost = lastPost - postperpage;
        let postRanges = sliders.slice(firstPost, lastPost);
        output = (
            <React.Fragment>
                {
                    postRanges.map((slider, index) =>
                    <tr key={index}>
                      <th scope="row">{slider.id}</th>
                      <td>                 
                        {slider.title}
                      </td>
                      <td>
                        {slider.sub_title}
                      </td>
                      <td>
                        {slider.message}
                      </td>
                      <td>
                        <img src={`${createImage(slider.image)}`} alt="" style={{width:"100px", height:"auto"}}/>
                      </td>
                      <td>{slider.created_at}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <OverlayTrigger
                            placement='top'
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Edit Slider
                              </Tooltip>
                            }
                          >
                            <Link to={`/admin/edit-slider/${slider.id}`}>
                              <div className="edit btn btn-outline-warning">
                                  <i className="bi bi-pen-fill"></i>
                              </div>
                            </Link>
                          </OverlayTrigger>
                          &nbsp;
                          <OverlayTrigger
                            placement='top'
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Delete Slider
                              </Tooltip>
                            }
                          >
                            <div className="delete btn btn-outline-danger" onClick={(e) => deleteSlider(e, slider.id)}>
                              {
                              deleting == slider.id ? 
                              (
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Deleting...</span>
                                    </div>
                                </div>
                              ):<i className="bi bi-trash3-fill"></i>
                              }
                            </div>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  )
                }
            </React.Fragment>
        );
      }else{
          output = (
            <React.Fragment>
              <tr className='mt-5'>
                  <td colSpan="7">
                      <div className="d-flex justify-content-center py-5">
                          <div className="text-primary">
                              <h5>There're no Slider Available</h5>
                          </div>
                      </div>
                  </td>
              </tr>
            </React.Fragment>
        );
      }
    }
  

  return (
    <div className='container'>
        <div className="row">
        <div className="col-12 mx-auto">
            <div className="card shadow my_online_shop_section">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h5 className='my-0 py-0'>Head Slider</h5>
                    <Link to="/admin/add-slider" type="button" className="btn btn-primary me-5">Add New Head Slider</Link>
                </div>
                <div className="card-body p-3 table-responsive">
                    <table className="table align-middle text-center table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Sub Title</th>
                                <th scope="col">Message</th>
                                <th scope="col">Image</th>
                                <th scope="col">Date Created</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {output}
                        </tbody>
                    
                    </table>
                    {
                    sliders.length > 5 &&
                    <div className="d-flex justify-content-end mt-5 me-5">
                        <Pagination postperpage={postperpage}  totalpost={sliders.length} paginate={paginate} currentNumber={currentNumber}/>
                    </div>  
                    }
                
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default SliderIndex