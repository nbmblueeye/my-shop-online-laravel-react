import React, {useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../../../../axiosClient';


const EditColor = () => {

  const [ loading, setLoading ] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  const [color, setColor] = useState({
     name: "",
     color_code: "",
     status: 1,
  });
  const [image, setImage] =  useState('');

  const _setColor = (e) => {
    setColor({...color, [e.target.name]: e.target.value})
  };
  
  const _setStatus = (e) => {
      if(e.currentTarget.checked){
        setColor({...color, status: 0});
      }else{
        setColor({...color, status: 1});
      }
  };

  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    showColor();
  }, [])

  const showColor = async() => {
    setLoading(true);
    await axiosClient.get(`/admin/show/color/${id}`)
    .then( res => {
        if(res && res.status == 202){
            setLoading(false);
            let { colors } = res.data;
            setColor({...color, ...{name: colors.name, color_code: colors.color_code, status: colors.status}});
          
            setImage(colors.image);
            createImage();
            setErrors({});
        }
    })
    .catch( err => {
        if(err){
            setLoading(false);
            console.log(err);
        }
    })
  }

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

  const editColor = async(e) => {
    e.preventDefault();

    setUpdating(true);
    let colorForm = new FormData();

    colorForm.append('name', color.name);
    colorForm.append('color_code', color.color_code);
    colorForm.append('status', color.status);

    colorForm.append('image', image);

    await axiosClient.post(`/admin/edit/color/${id}`, colorForm)
    .then(res => {
       if(res){
           if(res.status == 202){
              setUpdating(false);
              setErrors({});
              toast.fire({
                  icon: 'success',
                  text: res.data.message,
              });

              setTimeout(() => {
                navigate('/admin/colors');
             }, 2000);
           }
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
                <label htmlFor="name" className="col-form-label">Color Name:</label>
                <input type="text" className="form-control" id="name" name="name" value={color.name} onChange={(e) => _setColor(e)} />
                {errors.hasOwnProperty('name') && 
                errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
            </div>
            <div className="col">
                <label htmlFor="color_code" className="col-form-label">Color Code:</label>
                <input type="text" className="form-control" id="color_code" name="color_code" value={color.color_code} onChange={(e) => _setColor(e)}/>
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
                      <input className="form-check-input" name="status" type="checkbox" id="color_status" checked={color.status ? false:true} onChange={(e) => _setStatus(e)}/>
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
                   updating ?
                  <button className="btn btn-primary" type="button" disabled>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Adding...
                  </button>
                  :
                  <button className="btn btn-primary" type="button" onClick={(e) => editColor(e)}>Update Color</button>
              } 
          </div>    
        </>
      )
  }

  return (
    <div className="card my_online_shop_section">
      <div className="card-header py-3 d-flex justify-content-between">
          <h5>Update Color</h5>
          <Link to="/admin/colors" type="button" className="btn btn-outline-primary me-5">Back</Link>
      </div>
      <div className="card-body">
        {
          output
        }
      </div>
    </div>
  )
}

export default EditColor
