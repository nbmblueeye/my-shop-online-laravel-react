import React from 'react'
import { useProductContext } from '../../../contexts/product/ProductContext';

const ColorProduct = () => {

    let {colors, setColors, createImage} = useProductContext();

    const increaseColorQty = (e, id) => {
        e.preventDefault();
        setColors(colors.map(color =>color.color_id == id && color.color_qty < 10 ? {...color,color_qty:color.color_qty + 1}:color));
    }  
    const decreaseColorQty = (e, id) => {
        e.preventDefault();
        setColors(colors.map(color =>color.color_id == id && color.color_qty > 1 ? {...color,color_qty:color.color_qty - 1}:color));
    }  
    const setProductColorActive = (e, id) => {
        setColors(colors.map(color =>color.color_id == id ? {...color,status:e.target.checked ? 'checked':'unchecked'}:color));
    }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 g-4 g-3 my-3">
        {
            colors.length > 0 &&
            colors.map((color,index) => 
                <div className="col mb-3" key={index}>
                    <div className="card my_online_shop_component"  style={{width: '180px'}}>
                        <div className="card-body">
                            <div className="row">
                                <h6 className="card-title mb-3">Product Color:</h6>
                                <img src={createImage(`colors/${color.color_image}`)} style={{width:"60px"}}/>
                            </div>                                                          
                            <hr className="mt-1"/>
                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" name={`color_id_${color.color_id}`} checked={color.status == 'checked'?true:false} onChange={(e) => setProductColorActive(e,color.color_id)}/>
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
  )
}

export default ColorProduct
