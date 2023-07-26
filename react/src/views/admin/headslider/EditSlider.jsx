import React, {useRef, useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../../axiosClient';

const EditSlider = () => {

  const [image, setImage] =  useState("");
  const [slider, setSlider] = useState({
        title: "",
        sub_title: "",
        message: "",
  });

  const [loading, setLoading]   = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors]     = useState({});

  let { id } = useParams();
  let navigate = useNavigate();

  const _setSlider = (e) => {
        e.preventDefault();
        setSlider({...slider, [e.target.name]: e.target.value});
  }

  useEffect(() => {
    showSlider();
  }, []);


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

  const showSlider = async() => {
        setLoading(true);
        await axiosClient.get(`/admin/show/slider/${id}`)
        .then( res => {
            if(res && res.status == 202){
                let { slider } = res.data;   
                setSlider({...slider, ...{title:slider.title, sub_title:slider.sub_title, message:slider.message ? slider.message : ""}});
                setImage(slider.image);
                setErrors({});
                setLoading(false);
            }
        })
        .catch( err => {
            if(err){
                setLoading(false);
                console.log(err);
            }
        });

  }

  const  editSlider = async(e) => {
        e.preventDefault();
        setUpdating(true);

        let sliderForm = new FormData();
        sliderForm.append('title', slider.title);
        sliderForm.append('sub_title', slider.sub_title);
        sliderForm.append('message', slider.message);
        sliderForm.append('image', image);

        await axiosClient.post(`/admin/edit/slider/${id}`, sliderForm)
        .then(res => {
        if(res){
            if(res.status == 202){
                    setUpdating(false);
                    setErrors({});
                    toast.fire({
                        icon: 'success',
                        text: res.data.message,
                    });
                }
                setTimeout(() => {
                    navigate('/admin/sliders');
                }, 2000);
            }
        })
        .catch(err => {
            if(err){
                let { response } = err;
                if(response && response.status == 422){
                    setErrors(response.data.errors);
                    setUpdating(false);
                    toast.fire({
                        icon: 'warning',
                        text: "Required field need to be corrected!",
                    });
                }
            }
        }) 

  }

  let output = "";
  if(loading){
        output = (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
  }else{
      output = (
          <>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="title" className="col-form-label">Title:</label>
                    <input type="text" className="form-control" id="title" name="title"  value={slider.title} onChange={(e) => _setSlider(e)}/>
                </div>
                <div className="col">
                    <label htmlFor="sub_title" className="col-form-label">Sub Title:</label>
                    <input type="text" className="form-control" id="sub_title" name="sub_title" value={slider.sub_title} onChange={(e) => _setSlider(e)}/>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="message" className="col-form-label">Message:</label>
                <textarea className="form-control" id="message" name="message" value={slider.message} onChange={(e) => _setSlider(e)}></textarea>
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
                    updating ?
                    <button className="btn btn-primary" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Adding...
                    </button>
                    :
                    <button className="btn btn-primary" type="button" onClick={(e) => editSlider(e)}>Update Slider</button>
                } 
               
            </div>    
          </>    
      )
  }  

  return (
    <div className="card shadow my_online_shop_section">
      <div className="card-header py-3 d-flex justify-content-between">
        <h5>Edit Slider</h5>
        <Link to="/admin/sliders" type="button" className="btn btn-outline-primary me-5">Back</Link>
      </div>
      <div className="card-body">
        {
          output
        }
      </div>
    </div>
  )
}

export default EditSlider
