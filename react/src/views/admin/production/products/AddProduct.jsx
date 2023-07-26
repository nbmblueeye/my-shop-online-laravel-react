import React, { useState, useRef, useEffect } from 'react';
import axiosClient from '../../../../axiosClient';
import { Link, useNavigate } from 'react-router-dom';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ImageProduct from '../../../../components/admin/products/ImageProduct';
import { useProductContext } from '../../../../contexts/product/ProductContext';
import ColorProduct from '../../../../components/admin/products/ColorProduct';
import ProductDescription from '../../../../components/admin/products/ProductDescription';

const AddProduct = () => {

    let {colors, setColors } = useProductContext();

    const [image_thumbnail, setImage_thumbnail] = useState('');
    const [image_gallary, setImage_gallary] = useState([]);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [errors, setErrors]       = useState({});
    const [loading, setLoading ]    = useState(false);
    const [refresh, setRefresh] = useState(false);

    let nameRef                 = useRef(null);
    let slugRef                 = useRef(null);
    let category_idRef          = useRef(null);
    let brand_idRef             = useRef(null);
    let short_descriptionRef    = useRef(null);
    const [description, setDescription] = useState('');

    let meta_titleRef           = useRef(null);
    let meta_keywordRef         = useRef(null);
    let meta_descriptionRef     = useRef(null);

    let priceRef                = useRef(null);
    let sell_priceRef           = useRef(null);
    let quantityRef             = useRef(null);
    let statusRef               = useRef(null);
    let trendingRef             = useRef(null);
    let featureProductRef        = useRef(null);

    useEffect(() => {
        initProductData();
    }, []);

    const initProductData = async() => {
        await axiosClient.get('/admin/product-attributes')
        .then(res => {
          if(res && res.status == 200){
            let { categories, brands } = res.data;
            setCategories(categories);
            setBrands(brands);
          }
        })
        .catch(err => {
            if(err){
              console.log(err);
            }
        })
    }

    const addProduct = async(e) => {
        e.preventDefault();
        setLoading(true);
        
        let productForm = new FormData();
        productForm.append('name', nameRef.current.value);
        productForm.append('slug', slugRef.current.value);
        productForm.append('category_id', category_idRef.current.value);
        productForm.append('brand_id', brand_idRef.current.value);
        productForm.append('short_description', short_descriptionRef.current.value);
        productForm.append('description', description);

        productForm.append('meta_title', meta_titleRef.current.value);
        productForm.append('meta_keyword', meta_keywordRef.current.value);
        productForm.append('meta_description', meta_descriptionRef.current.value);

        productForm.append('price', priceRef.current.value);
        productForm.append('sell_price', sell_priceRef.current.value);
        productForm.append('quantity', quantityRef.current.value);
        productForm.append('status', statusRef.current.checked ? 0:1);
        productForm.append('trending', trendingRef.current.checked ? 0:1);
        productForm.append('featureProduct', featureProductRef.current.checked ? 0:1);

        productForm.append('image_thumbnail', image_thumbnail);

        if(image_gallary.length > 0){
            for(let i = 0; i < image_gallary.length;i++){
                productForm.append('image_gallary[]', JSON.stringify(image_gallary[i]));
            }
        }else{
            productForm.append('image_gallary[]', "");
        }

        if(colors.length > 0){
            for(let i = 0; i < colors.length;i++){
                if(colors[i].status == 'checked'){
                    productForm.append('colors[]', JSON.stringify(colors[i]));
                }
            }
        }else{
            productForm.append('colors[]', "");
        }
        await axiosClient.post('/admin/add/product', productForm)
        .then(res => {
            if(res){
                if(res.status == 201){
                    console.log(res.data);
                    setLoading(false);
                    toast.fire({
                        icon: 'success',
                        text: res.data.message,
                    });
                }
                setTimeout(() => {

                    nameRef.current.value = "";
                    slugRef.current.value = "";
                    category_idRef.current.value = "";
                    brand_idRef.current.value = "";
                    short_descriptionRef.current.value = "";
                    setDescription("");

                    meta_titleRef.current.value = "";
                    meta_keywordRef.current.value = "";
                    meta_descriptionRef.current.value = "";

                    priceRef.current.value = "";
                    sell_priceRef.current.value = "";
                    quantityRef.current.value = "";

                    statusRef.current.checked = false;
                    trendingRef.current.checked = false;
                    featureProductRef.current.checked = false;

                    setImage_thumbnail("");
                    setImage_gallary([]);

                    if(colors.length > 0){
                        setColors(colors.map(color => color.status == "checked" ? {...color, status:'unchecked'}:color));
                    }

                    setRefresh(true);

                }, 1000);
            }
        })
        .catch(err => {
            if(err){
                setLoading(false);
                let { response } = err;
                
                if(response && response.status == 422){
                    setErrors(response.data.errors);
                    toast.fire({
                        icon: 'warning',
                        text: "Required field need to be corrected!",
                    });
                }

                if(response && response.status == 404){
                    toast.fire({
                        icon: 'warning',
                        text: response.data.error,
                    });
                }
            }
        }) 
    };

  return (
    <div className="card shadow my_online_shop_section">
        <div className="card-header py-3 d-flex justify-content-between">
            <h5>Add New Product</h5>
            <Link to="/admin/products" type="button" className="btn btn-outline-primary me-5">Back</Link>
        </div>
        <div className="card-body">
            <Tabs defaultActiveKey="basic" id="fill-tab" className="mb-3" fill>
                <Tab eventKey="basic" title="Products">
                    <div className="row mb-5">
                        <div className="col">
                            <label htmlFor="name" className="col-form-label">Product Name:</label>
                            <input type="text" className="form-control" id="name" name="name" ref={nameRef}/>
                            {errors.hasOwnProperty('name') && errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <div className="col">
                            <label htmlFor="slug" className="col-form-label">Product Slug:</label>
                            <input type="text" className="form-control" id="slug" name="slug" ref={slugRef}/>
                            {errors.hasOwnProperty('slug') && errors.slug.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col">
                            <select className="form-select" aria-label="category_id" name='category_id' ref={category_idRef}>
                                <option value="">Select a Category</option>
                                {
                                    categories.length > 0 &&
                                    categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)
                                }
                            </select>
                            {errors.hasOwnProperty('category_id') && errors.category_id.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <div className="col">
                            <select className="form-select" aria-label="brand" name='brand_id' ref={brand_idRef}>
                                <option value="">Select a Brand</option>
                                {
                                    brands.length > 0 ?
                                    brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)
                                    :
                                    ""
                                }
                            </select> 
                            {errors.hasOwnProperty('brand_id') && errors.brand_id.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="short_description" className="col-form-label">Short Description(max = 500 w)</label>
                        <textarea className="form-control" id="short_description" name="short_description" ref={short_descriptionRef}/>
                        {errors.hasOwnProperty('short_description') && errors.short_description.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="col-form-label">Description:</label>
                        <ProductDescription name="add_product" description={description} setDescription={setDescription}/>
                    </div>
                </Tab>
                <Tab eventKey="seo-tag" title="SEO Tags">
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="meta_title" className="col-form-label">Meta Title:</label>
                            <input type="text" className="form-control" id="meta_title" name="meta_title" ref={meta_titleRef}/>
                        </div>
                        <div className="col">
                            <label htmlFor="meta_keyword" className="col-form-label">Meta Keyword:</label>
                            <input type="text" className="form-control" id="meta_keyword" name="meta_keyword" ref={meta_keywordRef}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="meta_description" className="col-form-label">Mata Description:</label>
                        <textarea className="form-control" id="meta_description" name="meta_description" ref={meta_descriptionRef}/>
                    </div>
                </Tab>
                <Tab eventKey="detail" title="Detail">
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="price" className="col-form-label">Price:</label>
                            <input type="text" className="form-control" id="price" name="price" ref={priceRef}/>
                            {errors.hasOwnProperty('price') && errors.price.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <div className="col">
                            <label htmlFor="sell_price" className="col-form-label">Sell Price:</label>
                            <input type="text" className="form-control" id="sell_price" name="sell_price" ref={sell_priceRef}/>
                            {errors.hasOwnProperty('sell_price') && errors.sell_price.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <div className="col">
                            <label htmlFor="quantity" className="col-form-label">Quantity:</label>
                            <input type="number" step={1} min="1" className="form-control"  id="quantity" name="quantity" ref={quantityRef}/>
                            {errors.hasOwnProperty('quantity') && errors.quantity.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}   
                        </div>
                    </div>
                    <div className="row my-3">
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="trending" ref={trendingRef}/>
                                <label className="form-check-label" htmlFor="trending">
                                    Trending
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="status" ref={statusRef}/>
                                <label className="form-check-label" htmlFor="status">
                                    Status
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="featureProduct" ref={featureProductRef}/>
                                <label className="form-check-label">
                                    Featured Product
                                </label>
                            </div>
                        </div>
                    </div>           
                </Tab>
                <Tab eventKey="image" title="Image">
                    <ImageProduct image_thumbnail={image_thumbnail} setImage_thumbnail={setImage_thumbnail} image_gallary={image_gallary} setImage_gallary={setImage_gallary}/>
                </Tab>
                <Tab eventKey="product_color" title="Product Color">
                   <ColorProduct/>       
                </Tab>
            </Tabs> 
            <hr className='mt-3'/>
            <div className="float-end">
                {
                    loading ?
                    <button className="btn btn-primary" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Adding...
                    </button>
                    :
                    <button className="btn btn-primary" type="button" onClick={(e) => addProduct(e)}>Save Product</button>
                } 
            </div>     
        </div>
    </div>
  )
}

export default AddProduct