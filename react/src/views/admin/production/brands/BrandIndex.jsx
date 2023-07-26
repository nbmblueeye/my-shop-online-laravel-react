import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../../../axiosClient';

import Pagination from '../../../../components/Pagination';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const BrandIndex = () => {

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [postperpage] =  useState(6);
  const [currentNumber, setCurrentNumber] = useState(1);
  const paginate = (current) => {
    setCurrentNumber(current);
  }

  useEffect(() => {
    initBrands();
    return () => {
      setRefresh(false);
    }
  }, [refresh]);

  const initBrands = async() => {
      setLoading(true);
      await axiosClient.get('/admin/brands')
      .then(res => {
        if(res && res.status == 200){
          setLoading(false);
          setBrands(res.data.brands);
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
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/brands/` + image;
        }
    }else{
        photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
    }
    return photo;
  };

  const deleteBrand = (e, id) => {
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
        axiosClient.get(`/admin/delete/brand/${id}`)
        .then(res => {
            if(res){
              if(res.status == 204){
                  setDeleting('');
                  setRefresh(true);
                  Swal.fire(
                    'Deleted!',
                     'Selected brand was deleted!',
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
    if(brands.length > 0){
      let lastPost  = currentNumber * postperpage;
      let firstPost = lastPost - postperpage;
      let postRanges = brands.slice(firstPost, lastPost);
      output = (
          <React.Fragment>
              {
                  postRanges.map((brand, index) =>
                  <tr key={index}>
                    <th scope="row">{brand.id}</th>
                    <td>                 
                      <p className='mb-0'>{brand.name}</p>
                      <p className="fst-italic">{brand.description ? (<span>({brand.description})</span>):""}</p>
                    </td>
                    <td>{brand.slug}</td>
                    <td>
                      <img src={`${createImage(brand.image)}`} alt="" style={{width:"80px"}}/>
                    </td>
                    <td>{brand.status == 0 ? "Visible":"Hidden"}</td>
                    <td>{brand.created_at}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <OverlayTrigger
                          placement='top'
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              Edit Brand
                            </Tooltip>
                          }
                        >
                          <Link to={`/admin/edit-brand/${brand.id}`}>
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
                              Delete Brand
                            </Tooltip>
                          }
                        >
                          <div className="delete btn btn-outline-danger" onClick={(e) => deleteBrand(e, brand.id)}>
                            {
                            deleting == brand.id ? 
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
                            <h5>There're no Brand Available</h5>
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
                  <h5 className='my-0 py-0'>Brands</h5>
                  <Link to="/admin/add-brand" type="button" className="btn btn-primary me-5">Add New Brand</Link>
              </div>
              <div className="card-body p-3 table-responsive">
                  <table className="table align-middle text-center table-bordered">
                      <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Slug</th>
                            <th scope="col">Image</th>
                            <th scope="col">Status</th>
                            <th scope="col">Created at</th>
                            <th scope="col">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                            {output}
                      </tbody>
                  
                  </table>
                  {
                    brands.length > 5 &&
                    <div className="d-flex justify-content-end mt-5 me-5">
                      <Pagination postperpage={postperpage}  totalpost={brands.length} paginate={paginate} currentNumber={currentNumber}/>
                    </div>  
                  }
                 
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandIndex