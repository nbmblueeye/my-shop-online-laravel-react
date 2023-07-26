import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LPagination from '../../../components/LPagination';
import axiosClient from '../../../axiosClient';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const UserIndex = () => {

  const [users, setUsers] = useState([]);
  const [items, setItems] = useState({});

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [search, setSearch] = useState("");
  const [showNumber, setShowNumber] = useState(5);

  useEffect(() => {
    getUsers();

    return () => {
      setRefresh(false);
    }
  }, [refresh]);

  const getUsers = async() => {
    setLoading(true);
    await axiosClient.get('/admin/users')
    .then(res => {
        if(res && res.status == 200){
          setLoading(false);
          setUsers(res.data.users);
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
           photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/users/` + image;
        }
    }else{
        photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
    }
    return photo;
  };

  const deleteUser = (e, id) => {
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
        axiosClient.get(`/admin/user/delete/${id}`)
        .then(res => {
            if(res){
              if(res.status == 204){
                  setDeleting(null);
                  setRefresh(true);
                  Swal.fire(
                    'Deleted!',
                     'Selected User was deleted!',
                    'success',
                  )
              }
            }
        })
        .catch(err => {
          let { response } = err;
          if(response && response.status == 404){
            toast.fire({
                icon: 'warning',
                text: response.data.error,
            });
          }
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
              <td colSpan="10">
                  <div className="d-flex justify-content-center py-5">
                      <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                      </div>
                  </div>
              </td>
          </tr>
      );
  }else{
    if(users.length > 0){
        output = (
            <React.Fragment>
                {
                    users.map((user, index) =>
                    <tr key={index}>
                        <th scope="row">{user.id}</th>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.hasRole}</td>
                        <td>
                            {      
                              <img key={index} src={createImage(user.avatar)}  alt={`image_${user.id}`} style={{width:'80px'}}/>
                            }
                        </td>
                        <td>
                            {user.created_at}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <OverlayTrigger
                              placement='top'
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Edit User
                                </Tooltip>
                              }
                            >
                              <Link to={`/admin/edit-user/${user.id}`}>
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
                                  Delete User
                                </Tooltip>
                              }
                            >
                              <div className="delete btn btn-outline-danger" onClick={(e) => deleteUser(e, user.id)}>
                                {
                                deleting == user.id ? 
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
                  <td colSpan="10">
                      <div className="d-flex justify-content-center py-5">
                          <div className="text-primary">
                              <h5>There're no User Available</h5>
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
          <div className="col-12 mx-auto mt-5">
            <div className="card shadow my_online_shop_section">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h5 className='my-0 py-0'>User</h5>
                    <Link to="/admin/add-user" type="button" className="btn btn-primary me-5">Add New User</Link>
                </div>
                <div className="card-body p-3 table-responsive">
                    <div className="row py-3">
                        <div className="col-sm-7 mb-3">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-md-3 g-3">
                              <div className="col mb-3">
                                <div className="d-flex align-items-center">
                                  <label className="form-label me-2">Show</label>
                                  <select className="form-select" style={{maxWidth:"70px", minWidth:"70px"}} value={showNumber} onChange={(e)=>setShowNumber(e.target.value)}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                  </select>
                                  <label className="form-label ms-2">User</label>
                                </div>
                              </div>
                            </div>  
                        </div>
                        <div className="col-sm-5 mb-3">
                          <form className="d-flex float-sm-end" role="search">
                            <input className="form-control me-2" type="search" style={{maxWidth:"300px", minWidth:"300px"}} placeholder="Search" aria-label="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                          </form>
                        </div>
                    </div>
                    <table className="table align-middle text-center table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Has Role</th>
                                <th scope="col">Avatar</th>
                                <th scope="col">Created at</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {output}
                        </tbody>
                    
                    </table>
                    {
                      items.total > items.per_page &&
                      <div className="d-flex justify-content-end mt-5 me-5">
                          <LPagination items={items}  onPaginate={onPaginate}/> 
                      </div>
                    }
                    
                </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default UserIndex