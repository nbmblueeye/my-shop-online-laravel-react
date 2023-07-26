import React,{ useState, useEffect } from 'react';
import axiosClient from '../../../axiosClient';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../../contexts/Auth/UserContext';

const ProfilePage = () => {

  const [image, setImage] =  useState("");
  const [user, setUser] = useState({
      name: "",
      email: "",
      phone: "",
      pin_code: "",
      address: "",
  }); 

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  const usercontext = useUserContext();

  const _setUser = (e) => {
      e.preventDefault();
      setUser({...user, [e.target.name]: e.target.value});
  };

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
    getProfile();
  }, [])

  const getProfile = async() => {
    setLoading(true);
    await axiosClient.get('/profile') 
    .then(res => {
        if(res && res.status == 201){
            let { data } = res.data;
            setLoading(false);  
            if(data.profile){
              setUser({...user,...{name: data.name, email: data.email, phone: data.profile.phone, pin_code: data.profile.pin_code, address: data.profile.address}});
            }else{
              setUser({...user,...{name: data.name, email: data.email}});
            }
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

  const editProfile = async(e) => {

      e.preventDefault();
      setUpdating(true);
      let profileForm = new FormData();
      profileForm.append('name', user.name);
      profileForm.append('email', user.email);
      profileForm.append('phone', user.phone);
      profileForm.append('pin_code', user.pin_code);
      profileForm.append('address', user.address);
      profileForm.append('avatar', image);

      await axiosClient.post(`/profile/edit`, profileForm)
      .then(res => {
        if(res){
          if(res.status == 202){
            setUpdating(false);
            setErrors({});
            toast.fire({
                icon: 'success',
                text: res.data.message,
            });
            usercontext._setUser( res.data.user );
          }
        }
      })
      .catch(err => {
        if(err){
          setUpdating(false);
          let { response } = err;
          if(response && response.status == 422){
              setErrors(response.data.errors);
          }else if(response && response.status == 401){
              toast.fire({
                  icon: 'warning',
                  text: response.data.error,
              });
          }
        }
      });

  };

  return (
    <MainLayout>
       <div className="p-5 my-online-shop-section">
          <div className="card shadow card-box">
            <div className="card-header py-3 d-flex justify-content-between">
              <h5>Your Profile</h5>
              <Link to="/profile/change-password" type="button" className="btn btn-outline-primary me-5">Change Password</Link>
            </div>
            <div className="card-body">
              {
                loading ?
                <div className="d-flex justify-content-center py-5 w-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              :
                <form onSubmit={(e) => editProfile(e)}>
                  <div className="row mb-3">
                      <div className="col-6">
                          <label className="col-form-label">User Name:</label>
                          <input type="text" className="form-control" name="name" value={user.name} onChange={(e) => _setUser(e)}/>
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
                  <div className="row mb-3">
                    <div className="col-6">
                          <label className="col-form-label">Phone:</label>
                          <input type="tel" className="form-control"name="phone" value={user.phone} onChange={(e) => _setUser(e)}/>
                          {errors.hasOwnProperty('phone') && 
                          errors.phone.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                      </div>
                      <div className="col-6">
                          <label className="col-form-label">Pin Code:</label>
                          <input type="text" className="form-control" name="pin_code" value={user.pin_code} onChange={(e) => _setUser(e)}/>
                          {errors.hasOwnProperty('pin_code') && 
                          errors.pin_code.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                      </div>
                    </div> 
                  <div className="row mb-5">
                      <div className="col-6">
                          <label className="col-form-label">Address:</label>
                          <textarea className="form-control" rows="3" name="address" value={user.address} onChange={(e) => _setUser(e)}/>
                        
                          {errors.hasOwnProperty('address') && 
                          errors.address.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                      </div>
                      <div className="col-6">  
                          <label className="col-form-label">Avatar:</label>
                          <div className="add-image-box">
                              <div className="add-image-name"><img src={createImage()} alt="" /></div> 
                              <input type="file" className="form-control" id="image-input" onChange={(e) => addImage(e)}/>
                          </div> 
                      </div>
                  </div> 
                  <hr />
                  <div className="float-end">
                      {
                          updating ?
                          <button className="btn btn-primary" type="button" disabled>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Updating...
                          </button>
                          :
                          <button className="btn btn-primary" type="submit">Update Profile</button>
                      } 
                  </div>
                </form>
              } 
            </div>
          </div>
        </div>
    </MainLayout>
  )
}

export default ProfilePage