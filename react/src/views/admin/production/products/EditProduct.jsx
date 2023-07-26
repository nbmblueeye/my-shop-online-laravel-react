import React, {useState, useEffect, useRef} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axiosClient from '../../../../axiosClient';
import ImageProduct from '../../../../components/admin/products/ImageProduct';
import ColorUpdateProduct from '../../../../components/admin/products/ColorUpdateProduct';
import { useProductContext } from '../../../../contexts/product/ProductContext';
import ProductDescription from '../../../../components/admin/products/ProductDescription';

const EditProduct = () => {

    let { _setU_Colors, color_products, setColor_Products} = useProductContext();
    const [image_thumbnail, setImage_thumbnail] = useState('');
    const [image_gallary, setImage_gallary] = useState([]);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [ errors, setErrors ]     = useState({});
    const [ loading, setLoading ]   = useState(false);
    const [ updating, setUpdating ] = useState(false);
    const [product, setProduct]     = useState({
        name:"",
        slug:"",
        category_id:"",
        brand_id:"",
        short_description:"",
        meta_title:"",
        meta_keyword:"",
        meta_description:"",
        price:"",
        sell_price:"",
        quantity:"",
        status:1,
        trending:1,
        featureProduct:1,
    });
    const [description, setDescription] = useState('');

    const _setProduct = (e) => {
        setProduct({...product, [e.target.name]: e.target.value})
    };

    const _setCheckBox = (e) => {
        if(e.currentTarget.checked){
          setProduct({...product, [e.currentTarget.name]: 0});
        }else{
          setProduct({...product, [e.currentTarget.name]: 1});
        }
    };

    let { id } = useParams();
 
    let navigate = useNavigate();

    useEffect(() => {
        showProduct();
    }, []);

    const showProduct = async() => {

        setLoading(true);
        await axiosClient.get(`/admin/show/product/${id}`)
        .then( res => {
            if(res && res.status == 202){
                setLoading(false);
                let {categories, brands, product, remain_color } = res.data;
                setCategories(categories);
                setBrands(brands);
    
                setProduct({...product, ...{
                        name:               product.name,
                        slug:               product.slug,
                        category_id:        product.category_id,
                        brand_id:           product.brand_id,
                        short_description:  product.short_description ? product.short_description:"",
                        meta_title:         product.meta_title ? product.meta_title:"",
                        meta_keyword:       product.meta_keyword ? product.meta_keyword:"",
                        meta_description:   product.meta_description ? product.meta_description:"",
                        price:              product.price,
                        sell_price:         product.sell_price ? product.sell_price: "",
                        quantity:           product.quantity,
                        status:             product.status,
                        trending:           product.trending,
                        featureProduct:     product.featureProduct,
                    }
                });
                setDescription(product.description);
                
                if( product.product_image.image_thumbnail ){
                    setImage_thumbnail(product.product_image.image_thumbnail);
                } 
                
                let gallary = JSON.parse(product.product_image.image_gallary);
                if(gallary.length > 0){
                    setImage_gallary(gallary);
                }
             
                _setU_Colors(remain_color);
                setColor_Products(product.product_color);
            }
        })
        .catch( err => {
            if(err){
                setLoading(false);
                if(err){
                    console.log(err);
                }
            }
        })
    }
    
    const editProduct = async(e) => {
        e.preventDefault();
        setUpdating(true);

        let productForm = new FormData();
        productForm.append('name', product.name);
        productForm.append('slug', product.slug);
        productForm.append('category_id', product.category_id);
        productForm.append('brand_id', product.brand_id);
        productForm.append('short_description', product.short_description);
        productForm.append('description', description);

        productForm.append('meta_title', product.meta_title);
        productForm.append('meta_keyword', product.meta_keyword);
        productForm.append('meta_description', product.meta_description);

        productForm.append('price', product.price);
        productForm.append('sell_price', product.sell_price);
        productForm.append('quantity', product.quantity);
        productForm.append('status', product.status);
        productForm.append('trending', product.trending);
        productForm.append('featureProduct', product.featureProduct);

        if(image_thumbnail){
            productForm.append('image_thumbnail', image_thumbnail);
        }else{
            productForm.append('image_thumbnail', "");
        }
        
        if(image_gallary.length > 0){
            for(let i = 0; i < image_gallary.length;i++){
                productForm.append('image_gallaries[]', JSON.stringify(image_gallary[i]));
            }
        }else{
            productForm.append('image_gallaries', "");
        }

        if(color_products.length > 0){
            for(let i = 0; i < color_products.length;i++){   
                productForm.append('color_products[]', JSON.stringify(color_products[i]));  
            }
        }else{
            productForm.append('color_products', "");
        }

        await axiosClient.post(`/admin/edit/product/${id}`, productForm)
        .then(res => {
            if(res){
                if(res.status == 201){
                    setUpdating(false);
                    toast.fire({
                        icon: 'success',
                        text: res.data.message,
                    });
                    setTimeout(() => {
                        navigate('/admin/products');
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
        

    };

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
            <Tabs defaultActiveKey="basic" id="fill-tab" className="mb-3" fill>
                <Tab eventKey="basic" title="Products">
                    <div className="row mb-5">
                        <div className="col">
                            <label htmlFor="name" className="col-form-label">Product Name:</label>
                            <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={(e) => _setProduct(e)}/>
                            {errors.hasOwnProperty('name') && errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <div className="col">
                            <label htmlFor="slug" className="col-form-label">Product Slug:</label>
                            <input type="text" className="form-control" id="slug" name="slug" value={product.slug} onChange={(e) => _setProduct(e)}/>
                            {errors.hasOwnProperty('slug') && errors.slug.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col">
                            <select className="form-select" aria-label="category_id" name='category_id' value={product.category_id} onChange={(e) => _setProduct(e)}>
                                <option value="">Select a Category</option>
                                {
                                    categories.length > 0 ?
                                    categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)
                                    :
                                    ""
                                }
                            </select>
                            {errors.hasOwnProperty('category_id') && errors.category_id.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <div className="col">
                            <select className="form-select" aria-label="brand" name='brand_id' value={product.brand_id} onChange={(e) => _setProduct(e)}>
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
                        <textarea className="form-control" id="short_description" name="short_description" value={product.short_description} onChange={(e) => _setProduct(e)}/>
                        {errors.hasOwnProperty('short_description') && errors.short_description.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}

                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="col-form-label">Description:</label>
                        <ProductDescription name="update_product" description={description} setDescription={setDescription}/>
                    </div>
                </Tab>
                <Tab eventKey="seo-tag" title="SEO Tags">
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="meta_title" className="col-form-label">Meta Title:</label>
                            <input type="text" className="form-control" id="meta_title" name="meta_title" value={product.meta_title} onChange={(e) => _setProduct(e)}/>
                        </div>
                        <div className="col">
                            <label htmlFor="meta_keyword" className="col-form-label">Meta Keyword:</label>
                            <input type="text" className="form-control" id="meta_keyword" name="meta_keyword" value={product.meta_keyword} onChange={(e) => _setProduct(e)}/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="meta_description" className="col-form-label">Mata Description:</label>
                        <textarea className="form-control" id="meta_description" name="meta_description" value={product.meta_description} onChange={(e) => _setProduct(e)}/>
                    </div>
                </Tab>
                <Tab eventKey="detail" title="Detail">
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="price" className="col-form-label">Price:</label>
                            <input type="text" className="form-control" id="price" name="price" value={product.price} onChange={(e) => _setProduct(e)}/>
                            {errors.hasOwnProperty('price') && errors.price.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <div className="col">
                            <label htmlFor="sell_price" className="col-form-label">Sell Price:</label>
                            <input type="text" className="form-control" id="sell_price" name="sell_price" value={product.sell_price} onChange={(e) => _setProduct(e)}/>
                            {errors.hasOwnProperty('sell_price') && errors.sell_price.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                        </div>
                        <div className="col">
                            <label htmlFor="quantity" className="col-form-label">Quantity:</label>
                            <input type="number" step={1} min="1" className="form-control"  id="quantity" name="quantity" value={product.quantity} onChange={(e) => _setProduct(e)}/>
                            {errors.hasOwnProperty('quantity') && errors.quantity.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}   
                        </div>
                    </div>
                    <div className="row my-3">
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="trending" checked={product.trending ? false:true} onChange={(e) => _setCheckBox(e)}/>
                                <label className="form-check-label">
                                    Trending
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="status" checked={product.status ? false:true} onChange={(e) => _setCheckBox(e)}/>
                                <label className="form-check-label">
                                    Status
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="featureProduct" checked={product.featureProduct ? false:true} onChange={(e) => _setCheckBox(e)}/>
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
                    <ColorUpdateProduct/>          
                </Tab>
            </Tabs> 
            </>     
        )
    }
  
  return (
    <div className="card shadow my_online_shop_section">
        <div className="card-header py-3 d-flex justify-content-between">
            <h5>Edit Product</h5>
            <Link to="/admin/products" type="button" className="btn btn-outline-primary me-5">Back</Link>
        </div>
        <div className="card-body">
                { output }
            <hr className='mt-3'/>
            <div className="float-end">
                {
                    updating ?
                    <button className="btn btn-primary" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Updating...
                    </button>
                    :
                    <button className="btn btn-primary" type="button" onClick={(e) =>editProduct(e)}>Update Product</button>
                } 
            </div>     
        </div>
    </div>
  )
}

export default EditProduct
