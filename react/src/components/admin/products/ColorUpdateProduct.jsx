import React, { useState } from 'react'
import { useProductContext } from '../../../contexts/product/ProductContext';

const ColorUpdateProduct = () => {
  
    let { u_colors, setU_Colors, color_products, setColor_Products} = useProductContext();
    let [deletePI, setDeletePI] = useState();

    const increaseColorQty = (e, id) => {
        e.preventDefault();
        setU_Colors( u_colors.map(color =>color.color_id == id && color.color_qty < 10 ? {...color,color_qty:color.color_qty + 1}:color));
    }  
    const decreaseColorQty = (e, id) => {
        e.preventDefault();
        setU_Colors( u_colors.map(color =>color.color_id == id && color.color_qty > 1 ? {...color,color_qty:color.color_qty - 1}:color));
    }  
    const setProductColorActive = (e, id) => {
        setDeletePI('');
        if(e.target.checked){
            let selectedColorPrs = u_colors.filter(color =>color.color_id == id);

            let newColorPr = selectedColorPrs.map(selectedColorPr => {
                return {id:null, color_id: selectedColorPr.color_id, name:selectedColorPr.color_name, image:selectedColorPr.color_image, product_color_qty:selectedColorPr.color_qty}
            })
            setColor_Products([...color_products,...newColorPr]);
            setU_Colors( u_colors.filter(color =>color.color_id != id));
        }else{
            return false;
        }
    }

    const updateProductColor_Qty = (e, color_id, action) => {
        e.preventDefault();
        if(action == 'increase'){
            setColor_Products( color_products.map(color_product =>color_product.color_id == color_id && color_product.product_color_qty < 10 ? {...color_product,product_color_qty:color_product.product_color_qty + 1}:color_product));
        }else{
            setColor_Products( color_products.map(color_product =>color_product.color_id == color_id && color_product.product_color_qty > 1 ? {...color_product,product_color_qty:color_product.product_color_qty - 1}:color_product));
        }
    }

    const deleteProductColor = (e, color_id) => {
        e.preventDefault();
        setDeletePI(color_id);

        let deletePC = color_products.filter(color_product => color_product.color_id == color_id);
        let outputColors = deletePC.map((color_product) => {
            if(color_product.color_id == color_id && color_product.id){
                return {color_id:color_product.color_id, color_name:color_product.color.name, color_image:color_product.color.image, color_qty: 1, status:'unchecked'};
            }else if(color_product.color_id == color_id && color_product.id == null){
                return {color_id:color_product.color_id, color_name:color_product.name, color_image:color_product.image, color_qty: 1, status:'unchecked'};
            }
        });

        setColor_Products(color_products.filter(color_product => color_product.color_id != color_id));
        setU_Colors([...u_colors, ...outputColors]);
    }

    const createImage = (image) => {
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


    return (
        <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 g-4 my-3">
                {
                    u_colors.length > 0 &&
                    u_colors.map((color,index) => 
                        <div className="col mb-3" key={index}>
                            <div className="card my_online_shop_component" style={{width: '180px'}}>
                                <div className="card-body">
                                    <div className="row">
                                        <h6 className="card-title mb-3">Product Color:</h6>
                                        <img src={createImage(`${color.color_image}`)} style={{width:"60px"}}/>
                                    </div>                                                          
                                    <hr className="mt-1"/>
                                    <div className="form-check mb-3">
                                        <input className="form-check-input" type="checkbox" name={`color_id_${color.color_id}`}  onChange={(e) => setProductColorActive(e,color.color_id)}/>
                                        <label className="form-check-label">
                                            {color.color_name}
                                        </label>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quantity:</label>
                                        <div className="input-group">
                                            <span className="input-group-text" style={{cursor:'pointer'}} onClick={(e) => increaseColorQty(e, color.color_id)}>+</span>
                                            <div className="form-control text-center" style={{maxWidth:"60px"}}>{color.color_qty}</div>
                                            <span className="input-group-text" style={{cursor:'pointer'}} onClick={(e) => decreaseColorQty(e, color.color_id)}>-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }                   
            </div> 
            <div className="card border-0 my_online_shop_section">
                <div className="card-body">
                    <React.Fragment>
                    <div  className="table-responsive">
                      <table className="table align-middle text-center table-bordered">    
                        <thead>
                            <tr>
                                <th scope="col" className='text-center' style={{width: "20%" }}>Color Code</th>
                                <th scope="col" style={{width: "20%" }}>Color Image</th>
                                <th scope="col" style={{width: "20%" }}>Qty</th>
                                <th scope="col" className='text-center' style={{width: "20%" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                color_products.length > 0 &&
                                color_products.map((product_color, index) => 
                            
                                    <tr key={index}>
                                        {
                                            product_color.id ?
                                            <th scope="row" className='text-center align-middle' style={{width: "20%"}}>{product_color.color ? product_color.color.name:""}</th>
                                            :
                                            <th scope="row" className='text-center align-middle' style={{width: "20%"}}>{product_color.name ? product_color.name:""}</th>
                                        }
                                        
                                        <td style={{width: "10%"}}>
                                            {
                                                product_color.id ?
                                                <img src={createImage(product_color.color.image)} style={{width:"60px"}}/> 
                                                :
                                                <img src={createImage(product_color.image)} style={{width:"60px"}}/> 
                                            }
                                        </td>
                                        <td style={{width: "10%"}}>
                                            <div className="input-group align-middle d-flex justify-content-center">
                                                <span className="input-group-text" style={{cursor:'pointer'}} onClick={(e) => updateProductColor_Qty(e, product_color.color_id, 'increase')}>+</span>
                                                <div className="form-control text-center" style={{maxWidth:"60px"}}>{product_color.product_color_qty}</div>
                                                <span className="input-group-text" style={{cursor:'pointer'}} onClick={(e) => updateProductColor_Qty(e, product_color.color_id, 'decrease')}>-</span>
                                            </div> 
                                        </td>
                                        <td  className='text-center align-middle' style={{width: "20%"}}>
                                            <div className="delete btn btn-outline-danger" onClick={(e) => deleteProductColor(e, product_color.color_id )}>
                                                {
                                                    deletePI == product_color.color_id ? 
                                                (
                                                    <div className="d-flex justify-content-center">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                ):<i className="bi bi-trash3-fill"></i>
                                                } 
                                            </div>
                                        </td>
                                    </tr>
                                )

                            }      
                        </tbody>
                    </table>
                    </div>
                    </React.Fragment>
                </div>
            </div> 
        </>
    )

}

export default ColorUpdateProduct



