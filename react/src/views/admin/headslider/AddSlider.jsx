import React, {useRef, useState} from 'react';
import { Link} from 'react-router-dom';
import axiosClient from '../../../axiosClient';


const AddSlider = () => {

  const titleRef = useRef();
  const sub_titleRef = useRef();
  const messageRef = useRef();
  const [image, setImage] =  useState("");

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
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/headsliders/` + image;
        }
    }else{
        photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
    }
    return photo;
  };

  const addSlider = async(e) => {
    e.preventDefault();
    setLoading(true);

    let sliderForm = new FormData();
    sliderForm.append('title', titleRef.current.value);
    sliderForm.append('sub_title', sub_titleRef.current.value);
    sliderForm.append('message', messageRef.current.value);
    sliderForm.append('image', image);

    await axiosClient.post('/admin/add/slider', sliderForm)
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
              titleRef.current.value = "",
              sub_titleRef.current.value = "",
              messageRef.current.value = "",
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
  }

  return (
    <div className="card shadow my_online_shop_section">
      <div className="card-header py-3 d-flex justify-content-between">
          <h5>Add New Slider</h5>
          <Link to="/admin/sliders" type="button" className="btn btn-outline-primary me-5">Back</Link>
      </div>
      <div className="card-body">

            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="title" className="col-form-label">Title:</label>
                    <input type="text" className="form-control" id="title" name="title" ref={titleRef}/>
                </div>
                <div className="col">
                    <label htmlFor="sub_title" className="col-form-label">Sub Title:</label>
                    <input type="text" className="form-control" id="sub_title" name="sub_title" ref={sub_titleRef}/>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="message" className="col-form-label">Message:</label>
                <textarea className="form-control" id="message" name="message" ref={messageRef}></textarea>
            </div>
            <div className="row mb-5">
                <div className="col-6 col-md-4">
                    <label htmlFor="image" className="col-form-label">Slider Image:</label>
                    <div className="add-image-box">
                        <div className="add-image-name"><img src={createImage()} alt="" /></div> 
                        <input type="file" className="form-control" id="image-input" onChange={(e) => addImage(e)}/>
                    </div> 
                </div>
                {errors.hasOwnProperty('image') && errors.image.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
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
                    <button className="btn btn-primary" type="button" onClick={(e) => addSlider(e)}>Save Slider</button>
                } 
            </div>    

      </div>
    </div>
  )
}

export default AddSlider