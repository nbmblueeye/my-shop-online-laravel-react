import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../../axiosClient';
import Pagination from '../../../../components/Pagination';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const ColorIndex = () => {

  const [colors, setColors] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [postperpage] =  useState(6);
  const [currentNumber, setCurrentNumber] = useState(1);
  const paginate = (current) => {
    setCurrentNumber(current);
  }

  useEffect(() => {
    initColors();
    return () => {
      setRefresh(false);
    }
  }, [refresh]);

  const initColors = async() => {
      setLoading(true);
      await axiosClient.get('/admin/colors')
      .then(res => {
        if(res && res.status == 200){
          setLoading(false);
          setColors(res.data.colors);
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
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/colors/` + image;
        }
    }else{
        photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
    }
    return photo;
  };

  const deleteColor = (e, id) => {
    e.preventDefault();
    setDeleting(id);
    Swal.fire({
      title: 'Are you sure, You want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.get(`/admin/delete/color/${id}`)
        .then(res => {
            if(res){
              if(res.status == 204){
                  setDeleting('');
                  setRefresh(true);
                  Swal.fire(
                    'Deleted!',
                     'Selected Color was deleted!',
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
    if(colors.length > 0){
      let lastPost  = currentNumber * postperpage;
      let firstPost = lastPost - postperpage;
      let postRanges = colors.slice(firstPost, lastPost);
      output = (
          <React.Fragment>
              {
                  postRanges.map((color, index) =>
                  <tr key={index}>
                    <th scope="row">{color.id}</th>
                    <td>                 
                      {color.name}
                    </td>
                    <td>{color.color_code}</td>
                    <td>
                      <img src={`${createImage(color.image)}`} alt="" style={{width:"80px"}}/>
                    </td>
                    <td>{color.status == 0 ? "Visible":"Hidden"}</td>
                    <td>{color.created_at}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <OverlayTrigger
                          placement='top'
                          overlay={
                            <Tooltip id={`tooltip-top`}>
                              Edit Color
                            </Tooltip>
                          }
                        >
                          <Link to={`/admin/edit-color/${color.id}`}>
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
                              Delete Color
                            </Tooltip>
                          }
                        >
                          <div className="delete btn btn-outline-danger" onClick={(e) => deleteColor(e, color.id)}>
                            {
                            deleting == color.id ? 
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
                            <h5>There're no Color Available</h5>
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
                  <h5 className='my-0 py-0'>Colors</h5>
                  <Link to="/admin/add-color" type="button" className="btn btn-primary me-5">Add New Color</Link>
              </div>
              <div className="card-body p-3 table-responsive">
                  <table className="table align-middle text-center table-bordered">
                      <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Color Name</th>
                            <th scope="col">Color Code</th>
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
                    colors.length > 5 &&
                    <div className="d-flex justify-content-end mt-5 me-5">
                      <Pagination postperpage={postperpage}  totalpost={colors.length} paginate={paginate} currentNumber={currentNumber}/>
                    </div>  
                  }
                
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorIndex
