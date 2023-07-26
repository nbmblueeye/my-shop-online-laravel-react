import React, { useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../../../axiosClient';

const EditBrand = () => {

    const [image, setImage] =  useState("");

    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState({});

    const [categories, setCategories] = useState([]);
    const [brand, setBrand] = useState({
        category_id: 0,
        name:"",
        slug:"",
        description:"",
        status:1,
    });

    let { id } = useParams();
    let navigate = useNavigate();

    const _setBrand = (e) => {
        setBrand({...brand, [e.target.name]: e.target.value})
    };

    const _setStatus = (e) => {
        if(e.currentTarget.checked){
            setBrand({...brand, status: 0});
        }else{
            setBrand({...brand, status: 1});
        }
    };

    useEffect(() => {
      showBrand();
    }, [])

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
                photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/brands/` + image;
            }
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
        }
        return photo;
    };
  
    const showBrand = async() => {
      setLoading(true);

      await axiosClient.get(`/admin/show/brand/${id}`)
      .then( res => {
          if(res && res.status == 202){
              setLoading(false);
              let { brands, categories } = res.data;
              setCategories(categories);
              setBrand({...brand, ...{category_id: brands.category_id, name: brands.name, slug: brands.slug, description: brands.description, status: brands.status}});
              setImage(brands.image);
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

    const editBrand = async(e) => {
       e.preventDefault();
       setUpdating(true);

       let brandForm = new FormData();
       brandForm.append('category_id', parseInt(brand.category_id));
       brandForm.append('name', brand.name);
       brandForm.append('slug', brand.slug);
       brandForm.append('description', brand.description);
       brandForm.append('status', brand.status);
       brandForm.append('image', image);

       await axiosClient.post(`/admin/edit/brand/${id}`, brandForm)
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
                navigate('/admin/brands');
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
                }else if(response && response.status == 404){
                    setUpdating(false);
                    toast.fire({
                        icon: 'warning',
                        text: response.data.error,
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
                        <label htmlFor="name" className="col-form-label">Brand Name:</label>
                        <input type="text" className="form-control" id="name" name="name" value={brand.name} onChange={(e) => _setBrand(e)}/>
                        {errors.hasOwnProperty('name') && 
                        errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                    </div>
                    <div className="col">
                        <label htmlFor="slug" className="col-form-label">Brand Slug:</label>
                        <input type="text" className="form-control" id="slug" name="slug" value={brand.slug} onChange={(e) => _setBrand(e)}/>
                        {errors.hasOwnProperty('slug') && 
                        errors.slug.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-6">
                        <label htmlFor="name" className="col-form-label">Category</label>
                        <select className="form-select" aria-label="category" name='category_id' value={brand.category_id} onChange={(e) => _setBrand(e)}>
                            <option value="">Select a Category</option>
                            {
                                categories.length > 0 ?
                                categories.map((category) => <option key={category.id} value={parseInt(category.id)}>{category.name}</option>)
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
                    <textarea className="form-control" id="description" name="description" value={brand.description} onChange={(e) => _setBrand(e)}></textarea>
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
                            <input className="form-check-input" name="status" type="checkbox" id="status" checked={brand.status ? false:true} onChange={(e) => _setStatus(e)}/>
                            <label className="form-check-label" htmlFor="status" >
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
                        updating ?
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Adding...
                        </button>
                        :
                        <button className="btn btn-primary" type="button" onClick={(e) => editBrand(e)}>Update Brand</button>
                    } 
                </div>    
            </>    
        )
    }  

    return (
        <div className="card my_online_shop_section">
            <div className="card-header py-3 d-flex justify-content-between">
            <h5>Edit Brand</h5>
            <Link to="/admin/brands" type="button" className="btn btn-outline-primary me-5">Back</Link>
            </div>
            <div className="card-body">
            {
                output
            }
            </div>
        </div>
    )
}

export default EditBrand