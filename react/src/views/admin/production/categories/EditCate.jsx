import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../../../axiosClient';

const EditCate = () => {

    let { id }  = useParams();
    let navigate = useNavigate();

    const [image, setImage] =  useState("");
    const [category, setCategory] = useState({
        name:"",
        slug:"",
        description:"",
        status: 1,
        meta_title:"",
        meta_keyword:"",
        meta_description:"",
    });
   
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
                photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/categories/` + image;
            }
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
        }
        return photo;
    };

    const _setCategory = (e) => {
        setCategory({...category, [e.target.name]: e.target.value})
    };

    const _setStatus = (e) => {
        if(e.currentTarget.checked){
            setCategory({...category, status: 0});
        }else{
            setCategory({...category, status: 1});
        }
    };

    useEffect(() => {
        showCategory();
    }, []);

    const showCategory = async() => {

        setLoading(true);
        await axiosClient.get(`/admin/show/category/${id}`)
        .then( res => {
            if(res && res.status == 202){
                setLoading(false);
                let { categories } = res.data;

                setCategory({...category, ...{
                    name: categories.name, 
                    slug: categories.slug, 
                    description: categories.description, 
                    status: categories.status,
                    meta_title: categories.meta_title , 
                    meta_keyword: categories.meta_keyword,
                    meta_description: categories.meta_description
                }});

                setImage(categories.image);
                setErrors({});
            }
        })
        .catch( err => {
            if(err){
                setLoading(false);
                console.log(err);
            }
        })
    };

    const editCategory = async(e) => {
        e.preventDefault();
        setLoading(true);
    
        let cateForm = new FormData();
        cateForm.append('name', category.name);
        cateForm.append('slug', category.slug);
        cateForm.append('description', category.description);
        cateForm.append('status', category.status);
        cateForm.append('meta_title', category.meta_title);
        cateForm.append('meta_keyword', category.meta_keyword);
        cateForm.append('meta_description', category.meta_description);
        cateForm.append('image', image);

        await axiosClient.post(`/admin/edit/category/${id}`, cateForm)
        .then(res => {
            if(res){
                if(res.status == 202){
                    setLoading(false);
                    setErrors({});
                    toast.fire({
                        icon: 'success',
                        text: res.data.message,
                    });
                   
                   setTimeout(() => {
                        navigate('/admin/categories');
                   }, 2000);
                }
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
                <div className="tab-pane fade show active" id="nav-category" role="tabpanel" aria-labelledby="nav-category-tab" tabIndex="0">
                        <div className="row mb-3">
                            <div className="col">
                                <label htmlFor="name" className="col-form-label">Category Name:</label>
                                <input type="text" className="form-control" id="name" name="name" value={category.name} onChange={(e) => _setCategory(e)}/>
                                {errors.hasOwnProperty('name') && 
                                errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col">
                                <label htmlFor="slug" className="col-form-label">Category Slug:</label>
                                <input type="text" className="form-control" id="slug" name="slug" value={category.slug} onChange={(e) => _setCategory(e)}/>
                                {errors.hasOwnProperty('slug') && 
                                errors.slug.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="col-form-label">Category Description:</label>
                            <textarea className="form-control" id="description" name="description" value={category.description} onChange={(e) => _setCategory(e)}/>
                        </div>
                        <div className="row mb-5">
                            <div className="col">
                                <label htmlFor="category-image" className="col-form-label">Category Image:</label>
                                <div className="add-image-box">
                                    <div className="add-image-name"><img src={createImage()} alt="" /></div> 
                                    <input type="file" className="form-control" id="image-input" onChange={(e) => addImage(e)}/>
                                </div> 
                            </div>
                            <div className="col">
                                <div className="form-check mt-5">
                                    <input className="form-check-input" name="status" type="checkbox" id="status" checked={category.status ? false:true} onChange={(e) => _setStatus(e)}/>
                                    <label className="form-check-label" htmlFor="status" >
                                        Category Status
                                    </label>
                                </div>
                            </div>
                            <div className="col">
                            </div>
                        </div>
                </div>
                <div className="tab-pane fade" id="nav-seo-category" role="tabpanel" aria-labelledby="nav-seo-category-tab" tabIndex="0">
                        <div className="row mb-3">
                            <div className="col">
                                <label htmlFor="meta_title" className="col-form-label">Meta Title:</label>
                                <input type="text" className="form-control" id="meta_title" name="meta_title" value={category.meta_title} onChange={(e) => _setCategory(e)}/>
                                {errors.hasOwnProperty('meta_title') && 
                                errors.meta_title.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col">
                                <label htmlFor="meta_keyword" className="col-form-label">Meta Keyword:</label>
                                <input type="text" className="form-control" id="meta_keyword" name="meta_keyword" value={category.meta_keyword} onChange={(e) => _setCategory(e)}/>
                                {errors.hasOwnProperty('meta_keyword') && 
                                errors.meta_keyword.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="meta_description" className="col-form-label">Meta Description:</label>
                            <textarea className="form-control" id="meta_description" name="meta_description" value={category.meta_description} onChange={(e) => _setCategory(e)}></textarea>
                            {errors.hasOwnProperty('meta_description') && 
                                errors.meta_description.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <hr />
                        <div className="float-end">
                            <button className="btn btn-primary" type="button" onClick={(e) => editCategory(e)}>Update Category</button>
                        </div>
                </div>
            </>    
        )
  }   

  return (
        <div className="card my_online_shop_section">
            <div className="card-header py-3 d-flex justify-content-between">
                <h5>Edit Category</h5>
                <Link to="/admin/categories" type="button" className="btn btn-outline-primary me-5">Back</Link>
            </div>
            <div className="card-body">
                    <nav>
                        <div className="nav nav-tabs mb-5" id="nav-tab" role="tablist">
                            <button className="nav-link active" id="nav-category-tab" data-bs-toggle="tab" data-bs-target="#nav-category" type="button" role="tab" aria-controls="nav-category" aria-selected="true">Category</button>
                            <button className="nav-link" id="nav-seo-category-tab" data-bs-toggle="tab" data-bs-target="#nav-seo-category" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Seo Tags</button>
                        </div>
                    </nav>
                <div className="tab-content" id="nav-tabContent">
                {
                    output
                }
                </div>
            </div>
        </div>
    )
}

export default EditCate