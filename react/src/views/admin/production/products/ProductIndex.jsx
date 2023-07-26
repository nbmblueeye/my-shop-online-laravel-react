import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../../axiosClient';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import LPagination from '../../../../components/LPagination';

const ProductIndex = () => {

  const [categories, seCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState({});

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [search, setSearch] = useState("");
  const [showNumber, setShowNumber] = useState(5);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');

  const [filter, setFilter] = useState({
      s: null,
      num: 5,
      category_id:[],
      brand_id:[],
  });

  const _setFilter = () => {
    setFilter({...filter, ...{ s: search, num: showNumber, category: category, brand: brand}});
  }

  useMemo(() =>  _setFilter(), [search, showNumber, category, brand]);

  const createImage = (image) => {
    let photo = "";
    if(image){
        if(image.indexOf('base64') !== -1){
            photo = image
        }else{
           photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/products/thumbnails/` + image;
        }
    }else{
        photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
    }
    return photo;
  };

  useEffect(() => {
    initProducts();
    return () => {
      setRefresh(false);
    }
  }, [refresh, showNumber, search, category, brand]);

  const onPaginate = (url) => {
      initProducts(url);
  }

  const initProducts = async(link) => {
      setLoading(true);
      let url = link ? link:'/admin/products'; 
      await axiosClient.get(url,{params:filter})
      .then(res => {
        if(res && res.status == 200){
          setLoading(false);
          let { categories, brands, products } = res.data;
          setBrands(brands);
          seCategories(categories);
          setProducts(products.data);
          setItems(products);
        }
      })
      .catch(err => {
          if(err){
            setLoading(false);
            console.log(err);
          }
      })
  }
 
  const deleteProduct = (e, id) => {
    e.preventDefault();
    setDeleting(id);
    Swal.fire({
      title: 'Are you sure, You want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.get(`/admin/delete/product/${id}`)
        .then(res => {
            if(res){
              if(res.status == 204){
                  setDeleting('');
                  setRefresh(true);
                  Swal.fire(
                    'Deleted!',
                     'Selected Product was deleted!',
                    'success'
                  )
              }
            }
        })
        .catch(err => { 
          setDeleting('');
           if(err){
              let { response } = err;
              if(response && response.status == 404){
                toast.fire({
                    icon: 'warning',
                    text: response.data.error,
                });
              }
           }
        })
      }else{
        setDeleting('');
      }
    })
  }

  let output = "";
  if(loading){
      output = (
          <tr className='mt-5'>
              <td colSpan="10">
                  <div className="d-flex justify-content-center py-5">
                      <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                      </div>
                  </div>
              </td>
          </tr>
      );
  }else{
    if(products.length > 0){
        output = (
            <React.Fragment>
                {
                    products.map((product, index) =>
                    <tr key={index}>
                        <th scope="row">{product.id}</th>
                        <td>
                            <p className='mb-0'>{product.category.name}</p>
                        </td>
                        <td>                 
                            <p className='mb-0'>{product.name}</p>
                            <p className="fst-italic">{product.short_description ? (<span>({product.short_description})</span>):""}</p>
                        </td>
                        <td>{product.slug}</td>
                        <td>
                            <p className='mb-0'>{product.price}</p>
                        </td>
                        <td>
                            <p className='mb-0'>{product.quantity}</p>
                        </td>
                        <td>{product.status == 0 ? "Visible":"Hidden"}</td>
                        <td>
                            {      
                              <img key={index} src={createImage(product.product_image.image_thumbnail)}  alt={`image_${product.id}`} style={{width:'80px'}}/>
                            }
                        </td>
                        <td>
                            {product.created_at}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <OverlayTrigger
                              placement='top'
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Edit Product
                                </Tooltip>
                              }
                            >
                              <Link to={`/admin/edit-product/${product.id}`}>
                                <div className="edit btn btn-outline-warning">
                                    <i className="bi bi-pen-fill"></i>
                                </div>
                              </Link>
                            </OverlayTrigger>
                            &nbsp;
                            <OverlayTrigger
                              placement='top'
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Delete Product
                                </Tooltip>
                              }
                            >
                              <div className="delete btn btn-outline-danger" onClick={(e) => deleteProduct(e, product.id)}>
                                {
                                deleting == product.id ? 
                                (
                                  <div className="d-flex justify-content-center">
                                      <div className="spinner-border text-primary" role="status">
                                          <span className="visually-hidden">Deleting...</span>
                                      </div>
                                  </div>
                                ):<i className="bi bi-trash3-fill"></i>
                                }
                              </div>
                            </OverlayTrigger>
                          </div> 
                        </td>
                    </tr>
                    )
                }
            </React.Fragment>
        );
    }else{
            output = (
                <React.Fragment>
                    
                    <tr className='mt-5'>
                        <td colSpan="10">
                            <div className="d-flex justify-content-center py-5">
                                <div className="text-primary">
                                    <h5>There're no Product Available</h5>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                </React.Fragment>
            );
    }
  }

  return (
    <div className='container'>
      <div className="row">
          <div className="col-12 mx-auto mt-5">
            <div className="card shadow my_online_shop_section">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h5 className='my-0 py-0'>Product List</h5>
                    <Link to="/admin/add-product" type="button" className="btn btn-primary me-5">Add New Product</Link>
                </div>
                <div className="card-body p-3">
                    <div className="row py-3">
                        <div className="col-lg-7 mb-3">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-md-3 g-3">
                              <div className="col mb-3">
                                  <div className="d-flex align-items-center">
                                    <label className="form-label me-2">Show</label>
                                    <select className="form-select" style={{maxWidth:"70px", minWidth:"70px"}} value={showNumber} onChange={(e)=>setShowNumber(e.target.value)}>
                                      <option value="5">5</option>
                                      <option value="10">10</option>
                                      <option value="15">15</option>
                                      <option value="20">20</option>
                                    </select>
                                    <label className="form-label ms-2">Product</label>
                                  </div>
                              </div>
                              <div className="col mb-3">
                              
                                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value) } name='category' style={{maxWidth:"150px", minWidth:"150px"}}>
                                    <option value="">All Categories</option>
                                    {
                                      categories.length > 0 ?
                                      categories.map((category, index) => <option key={index} value={category.id}>{category.name}</option>)
                                      :
                                      ""
                                    }
                                </select>
                            
                              </div>
                              <div className="col mb-3">

                                <select className="form-select" value={brand} onChange={ (e) => setBrand(e.target.value) } name='brand' style={{maxWidth:"150px", minWidth:"150px"}}>
                                    <option value="">All Brands</option>
                                    {
                                      brands.length > 0 ?
                                      brands.map((brand,index) => <option key={index} value={brand.id}>{brand.name}</option>)
                                      :
                                      ""
                                    }
                                </select>

                              </div>
                            </div>  
                        </div>
                        <div className="col-lg-5 mb-3">
                          <form className="d-flex float-lg-end" role="search">
                            <input className="form-control me-2" type="search" style={{maxWidth:"300px", minWidth:"300px"}} placeholder="Search..." aria-label="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                          </form>
                        </div>
                       
                    </div>
                    <div  className="table-responsive">
                      <table className="table align-middle text-center table-bordered">
                          <thead>
                              <tr>
                                  <th scope="col">ID</th>
                                  <th scope="col">Category</th>
                                  <th scope="col">Product</th>
                                  <th scope="col">Product Slug</th>
                                  <th scope="col">Price</th>
                                  <th scope="col">Quantity</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Image</th>
                                  <th scope="col">Created at</th>
                                  <th scope="col">Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {output}
                          </tbody>
                      
                      </table>
                    </div>
                    {
                      items.total > items.per_page &&
                      <div className="d-flex justify-content-end mt-5 me-5">
                          <LPagination items={items}  onPaginate={onPaginate}/> 
                      </div>
                    }
                    
                </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default ProductIndex