import React, {useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../../axiosClient';

const AddCate = () => {

    const [image, setImage] =  useState("");
    const nameRef = useRef();
    const slugRef = useRef();
    const desfRef = useRef();
    const statusRef = useRef(null);
    const m_titleRef = useRef();
    const m_keywordRef = useRef(); 
    const m_desRef = useRef(); 

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

    const addCategory = async(e) => {
        e.preventDefault();
        setLoading(true);
   
        let cateForm = new FormData();
        cateForm.append('name', nameRef.current.value);
        cateForm.append('slug', slugRef.current.value);
        cateForm.append('description', desfRef.current.value);
        cateForm.append('status', statusRef.current.checked ? 0:1);
        cateForm.append('meta_title', m_titleRef.current.value);
        cateForm.append('meta_keyword', m_keywordRef.current.value);
        cateForm.append('meta_description', m_desRef.current.value);
        cateForm.append('image', image);

        await axiosClient.post('/admin/add/category', cateForm)
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
                    slugRef.current.value = "",
                    desfRef.current.value = "",
                    statusRef.current.checked = false,
                    m_titleRef.current.value = "",
                    m_keywordRef.current.value = "",
                    m_desRef.current.value = "",
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
        <div className="card my_online_shop_section">
            <div className="card-header py-3 d-flex justify-content-between">
                <h5>Add New Category</h5>
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
                    <div className="tab-pane fade show active" id="nav-category" role="tabpanel" aria-labelledby="nav-category-tab" tabIndex="0">
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="name" className="col-form-label">Category Name:</label>
                                    <input type="text" className="form-control" id="name" name="name" ref={nameRef}/>
                                    {errors.hasOwnProperty('name') && 
                                    errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                                </div>
                                <div className="col">
                                    <label htmlFor="slug" className="col-form-label">Category Slug:</label>
                                    <input type="text" className="form-control" id="slug" name="slug" ref={slugRef}/>
                                    {errors.hasOwnProperty('slug') && 
                                    errors.slug.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="col-form-label">Category Description:</label>
                                <textarea className="form-control" id="description" name="description" ref={desfRef}></textarea>
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
                                        <input className="form-check-input" name="status" type="checkbox" ref={statusRef}/>
                                        <label className="form-check-label">
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
                                    <input type="text" className="form-control" id="meta_title" name="meta_title" ref={m_titleRef}/>
                                    {errors.hasOwnProperty('meta_title') && 
                                    errors.meta_title.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                                </div>
                                <div className="col">
                                    <label htmlFor="meta_keyword" className="col-form-label">Meta Keyword:</label>
                                    <input type="text" className="form-control" id="meta_keyword" name="meta_keyword" ref={m_keywordRef}/>
                                    {errors.hasOwnProperty('meta_keyword') && 
                                    errors.meta_keyword.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="meta_description" className="col-form-label">Meta Description:</label>
                                <textarea className="form-control" id="meta_description" name="meta_description" ref={m_desRef}></textarea>
                                {errors.hasOwnProperty('meta_description') && 
                                    errors.meta_description.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
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
                                    <button className="btn btn-primary" type="button" onClick={(e) => addCategory(e)}>Save Category</button>
                                } 
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCate