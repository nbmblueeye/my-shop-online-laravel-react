import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../../axiosClient';

const AddColor = () => {

  const [errors, setErrors] = useState({});
  const [loading, setLoading ] = useState(false);

  const nameRef = useRef(null);
  const color_codeRef = useRef(null);
  const statusRef = useRef(null);
  const [image, setImage] =  useState("");

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
  };
  const createImage = () => {
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

  const addColor = async(e) => {
    e.preventDefault();
    setLoading(true);

    let colorForm = new FormData();
    colorForm.append('name', nameRef.current.value);
    colorForm.append('color_code', color_codeRef.current.value);
    colorForm.append('image', image);
    colorForm.append('status', statusRef.current.checked ? 0:1);
    await axiosClient.post('/admin/add/color', colorForm)
    .then(res => {
        if(res){
            if(res.status == 201){
                setLoading(false);
                toast.fire({
                    icon: 'success',
                    text: res.data.message,
                });
            }
            setTimeout(() => {
                nameRef.current.value = "",
                color_codeRef.current.value = "",
                statusRef.current.checked = false,
                setImage("");
                createImage();
                setErrors({});
            }, 1000);
        }
    })
    .catch(err => {
        if(err){
            let { response } = err;
            if(response && response.status == 422){
            setErrors(response.data.errors);
            setLoading(false);
            toast.fire({
                icon: 'warning',
                text: "Required field need to be corrected!",
            });
            }
        }
    })  
  };

  return (
    <div className="card my_online_shop_section">
      <div className="card-header py-3 d-flex justify-content-between">
          <h5>Add New Color</h5>
          <Link to="/admin/colors" type="button" className="btn btn-outline-primary me-5">Back</Link>
      </div>
      <div className="card-body">
        <div className="row mb-3">
            <div className="col">
                <label htmlFor="name" className="col-form-label">Color Name:</label>
                <input type="text" className="form-control" id="name" name="name" ref={nameRef}/>
                {errors.hasOwnProperty('name') && 
                errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
            </div>
            <div className="col">
                <label htmlFor="color_code" className="col-form-label">Color Code:</label>
                <input type="text" className="form-control" id="color_code" name="color_code" ref={color_codeRef}/>
                {errors.hasOwnProperty('color_code') && 
                errors.color_code.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
            </div>
        </div>
        <div className="row mb-5">
            <div className="col">
                <label htmlFor="color-image" className="col-form-label">Color Image:</label>
                <div className="add-image-box">
                    <div className="add-image-name"><img src={createImage()} alt="" /></div> 
                    <input type="file" className="form-control" id="image-input" onChange={(e) => addImage(e)}/>
                </div> 
            </div>
            <div className="col">
                <div className="form-check mt-5">
                    <input className="form-check-input" name="status" type="checkbox" id="color_status" ref={statusRef}/>
                    <label className="form-check-label" htmlFor="color_status" >
                        Color Status
                    </label>
                </div>
            </div>
            <div className="col">
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
                <button className="btn btn-primary" type="button" onClick={(e) => addColor(e)}>Save Color</button>
            } 
        </div>    
      </div>
    </div>
  )
}

export default AddColor