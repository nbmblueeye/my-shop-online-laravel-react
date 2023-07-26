import React, {useRef, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../../axiosClient';

const AddBrand = () => {

  const [image, setImage] =  useState("");
  const cateIdRef = useRef();
  const nameRef = useRef();
  const slugRef = useRef();
  const desfRef = useRef();
  const statusRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    initCategories();
  }, [])

  const initCategories = async() => {
    await axiosClient.get('/admin/categories')
    .then(res => {
      if(res && res.status == 200){
        setLoading(false);
        setCategories(res.data.categories);
      }
    })
    .catch(err => {
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
  }
  const createImage = () => {
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

  const addBrand = async(e) => {
      e.preventDefault();
      setLoading(true);

      let brandForm = new FormData();
      brandForm.append('category_id', cateIdRef.current.value);
      brandForm.append('name', nameRef.current.value);
      brandForm.append('slug', slugRef.current.value);
      brandForm.append('description', desfRef.current.value);
      brandForm.append('status', statusRef.current.checked ? 0:1);
      brandForm.append('image', image);

      await axiosClient.post('/admin/add/brand', brandForm)
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
                  cateIdRef.current.value = "",
                  nameRef.current.value = "",
                  slugRef.current.value = "",
                  desfRef.current.value = "",
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
              }else if(response && response.status == 404){
                toast.fire({
                    icon: 'warning',
                    text: response.data.error,
                });
            }
          }
      })  
  }

  return (
    <div className="card shadow my_online_shop_section">
        <div className="card-header py-3 d-flex justify-content-between">
            <h5>Add New Brand</h5>
            <Link to="/admin/brands" type="button" className="btn btn-outline-primary me-5">Back</Link>
        </div>
        <div className="card-body">
          <div className="row mb-3">
              <div className="col">
                  <label htmlFor="name" className="col-form-label">Brand Name:</label>
                  <input type="text" className="form-control" id="name" name="name" ref={nameRef}/>
                  {errors.hasOwnProperty('name') && 
                  errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
              </div>
              <div className="col">
                  <label htmlFor="slug" className="col-form-label">Brand Slug:</label>
                  <input type="text" className="form-control" id="slug" name="slug" ref={slugRef}/>
                  {errors.hasOwnProperty('slug') && 
                  errors.slug.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
              </div>
          </div>
          <div className="row mb-5">
              <div className="col-6">
                  <label htmlFor="name" className="col-form-label">Category</label>
                  <select className="form-select" aria-label="category" name='category_id' ref={cateIdRef}>
                      <option value="">Select a Category</option>
                      {
                          categories.length > 0 ?
                          categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)
                          :
                          ""
                      }
                  </select>
                  {errors.hasOwnProperty('category_id') && 
                    errors.category_id.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
              </div>
          </div>
          <div className="mb-3">
              <label htmlFor="description" className="col-form-label">Category Description:</label>
              <textarea className="form-control" id="description" name="description" ref={desfRef}></textarea>
          </div>
          <div className="row mb-5">
              <div className="col">
                  <label htmlFor="category-image" className="col-form-label">Brand Image:</label>
                  <div className="add-image-box">
                      <div className="add-image-name"><img src={createImage()} alt="" /></div> 
                      <input type="file" className="form-control" id="image-input" onChange={(e) => addImage(e)}/>
                  </div> 
              </div>
              <div className="col">
                  <div className="form-check mt-5">
                      <input className="form-check-input" name="status" type="checkbox" id="cate_status" ref={statusRef}/>
                      <label className="form-check-label" htmlFor="cate_status" >
                          Brand Status
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
                  <button className="btn btn-primary" type="button" onClick={(e) => addBrand(e)}>Save Brand</button>
              } 
          </div>    
        </div>
    </div>
  )
}

export default AddBrand
