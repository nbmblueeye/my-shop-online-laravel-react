import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../axiosClient';

const AddUser = () => {

    const [image, setImage] =  useState("");
    const nameRef           = useRef(null);
    const emailRef          = useRef(null);
    const hasRoleRef        = useRef(null);
    const passwordRef       = useRef(null);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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

    const addNewUser = async(e) => {
        e.preventDefault();
        setLoading(true);
  
        let userForm = new FormData();
        userForm.append('name', nameRef.current.value);
        userForm.append('email', emailRef.current.value);
        userForm.append('hasRole', hasRoleRef.current.value);
        userForm.append('password', passwordRef.current.value);
        userForm.append('avatar', image);

        await axiosClient.post('/admin/user/add', userForm)
        .then(res => {
            if(res && res.status == 201){

              setLoading(false);
              setErrors({});
              toast.fire({
                  icon: 'success',
                  text: res.data.message,
              });
              
              setTimeout(() => {
                nameRef.current.value  = "";
                emailRef.current.value = "";
                emailRef.current.value = "";
                hasRoleRef.current.value = "";
              }, 1000);

            }
        })
        .catch(err => {
            if(err){
                setLoading(false);
                let { response } = err;
                if(response && response.status == 422){
                    setErrors(response.data.errors);
                }
            }
        })
    }

  return (
    <div className="card shadow my_online_shop_section">
        <div className="card-header py-3 d-flex justify-content-between">
            <h5>Add New User</h5>
            <Link to="/admin/users" type="button" className="btn btn-outline-primary me-5">Back</Link>
        </div>
        <div className="card-body">
            <form onSubmit={(e) => addNewUser(e)}>
                <div className="row mb-3">
                    <div className="col-6">
                        <label className="col-form-label">User Name:</label>
                        <input type="text" className="form-control"name="name" ref={nameRef}/>
                        {errors.hasOwnProperty('name') && errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                    </div>
                    <div className="col-6">
                        <label className="col-form-label">User Email:</label>
                        <input type="text" className="form-control" name="email" ref={emailRef}/>
                        {errors.hasOwnProperty('email') && errors.email.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-6">
                        <label className="col-form-label">Has Role:</label>
                        <select className="form-select" aria-label="category" name='hasRole' ref={hasRoleRef}>
                            <option value="">Select A Role</option>  
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        {errors.hasOwnProperty('hasRole') && errors.hasRole.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                    </div>

                    <div className="col-6">
                        <label className="col-form-label">Password:</label>
                        <input type="text" className="form-control" name="password" ref={passwordRef}/>
                        {errors.hasOwnProperty('password') && errors.password.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
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
                        <button className="btn btn-primary" type="submit">Save User</button>
                    } 
                </div>
            </form>    
        </div>
    </div>
  )
}

export default AddUser