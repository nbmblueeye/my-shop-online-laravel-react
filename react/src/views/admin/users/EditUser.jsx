import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../../axiosClient';


const EditUser = () => {

  const [image, setImage] =  useState("");
  const [user, setUser] = useState({
      name: "",
      email: "",
      hasRole: "",
      password: "",
  }); 

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const _setUser = (e) => {
      e.preventDefault();
      setUser({...user, [e.target.name]: e.target.value});
  };


  let { user_id } = useParams();
  let navigate = useNavigate();

  const addImage = (e) => {
    e.preventDefault();

    let file = e.target.files[0];
    let size = file['size'];
    let limit = 2*1024*1024;
    let reader = new FileReader();
    if(limit < size) {
        alert("File too large");
        return false;
    }else{
        reader.onloadend = (file) => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    }
  }

  const createImage = () => {
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

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async() => {
    setLoading(true);
    await axiosClient.get(`/admin/user/${user_id}`) 
    .then(res => {
        if(res && res.status == 200){
            let { data } = res.data;
            console.log(res.data);
            setLoading(false);
            setUser({...user,...{name: data.name, email: data.email, hasRole: data.hasRole}});

            if(data.avatar){
                setImage(data.avatar);
            }
        }
    })
    .catch(err => {
        if(err){
          setLoading(false);
          console.log(err);
        }
    })
  }

  const editUser = async(e) => {
      e.preventDefault();
      setLoading(true);

      let userForm = new FormData();
      userForm.append('name', user.name);
      userForm.append('email', user.email);
      userForm.append('hasRole', user.hasRole);
      userForm.append('password', user.password);
      userForm.append('avatar', image);

      await axiosClient.post(`/admin/user/edit/${user_id}`, userForm)
      .then(res => {
        if(res){
          if(res.status == 202){
            setLoading(false);
            setErrors({});
            toast.fire({
                icon: 'success',
                text: res.data.message,
            });
          }
          setTimeout(() => {
              navigate('/admin/users');
          }, 2000);
        }
      })
      .catch(err => {
        if(err){
          setLoading(false);
          let { response } = err;
          if(response && response.status == 422){
              setErrors(response.data.errors);
          }else if(response && response.status == 404){
              toast.fire({
                  icon: 'warning',
                  text: response.data.error,
              });
          }
        }
      })
  };


  return (
    <div className="card shadow my_online_shop_section">
      <div className="card-header py-3 d-flex justify-content-between">
          <h5>Edit User</h5>
          <Link to="/admin/users" type="button" className="btn btn-outline-primary me-5">Back</Link>
      </div>
      <div className="card-body">
          <form onSubmit={(e) => editUser(e)}>
              <div className="row mb-3">
                  <div className="col-6">
                      <label className="col-form-label">User Name:</label>
                      <input type="text" className="form-control"name="name" value={user.name} onChange={(e) => _setUser(e)}/>
                      {errors.hasOwnProperty('name') && 
                      errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                  </div>
                  <div className="col-6">
                      <label className="col-form-label">User Email:</label>
                      <input type="text" className="form-control" name="email" value={user.email} onChange={(e) => _setUser(e)}/>
                      {errors.hasOwnProperty('email') && 
                      errors.email.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                  </div>
              </div>
              <div className="row mb-5">
                  <div className="col-6">
                      <label className="col-form-label">Has Role:</label>
                      <select className="form-select" aria-label="category" name='hasRole' value={user.hasRole} onChange={(e) => _setUser(e)}>
                          <option value="">Select A Role</option>  
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                      </select>
                      {errors.hasOwnProperty('hasRole') && errors.hasRole.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                  </div>

                  <div className="col-6">
                      <label className="col-form-label">Password:</label>
                      <input type="text" className="form-control" name="password" value={user.password} onChange={(e) => _setUser(e)}/>
                      {errors.hasOwnProperty('password') && 
                      errors.password.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                  </div>
                  
              </div> 
              <div className="row mb-5">
                  <div className="col-6">
                      <label htmlFor="category-image" className="col-form-label">Avatar:</label>
                      <div className="add-image-box">
                          <div className="add-image-name"><img src={createImage()} alt="" /></div> 
                          <input type="file" className="form-control" id="image-input" onChange={(e) => addImage(e)}/>
                      </div> 
                  </div>
              </div> 
              <hr />
              <div className="float-end">
                  {
                      loading ?
                      <button className="btn btn-primary" type="button" disabled>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Adding...
                      </button>
                      :
                      <button className="btn btn-primary" type="submit">Update User</button>
                  } 
              </div>
          </form>    
      </div>
    </div>

  )
} 

export default EditUser