import React, { useState, useEffect, useCallback, useRef} from 'react'

const FilterBrand = ({ categories ,brands, setFilters }) => {

    const [filterCates, setFilterCates]  = useState([]);
    const [filterbrands, setFilterBrand] = useState([]);
    const [filterprices, setFilterPrice] = useState([]);
    
    let _setFilterCates = (e) => {
        if(e.currentTarget.checked){
            if(!filterCates.find(cate => cate == e.currentTarget.value)){
                setFilterCates([...filterCates, e.currentTarget.value]);
            }
        }else if(!e.currentTarget.checked){
            if(filterCates.find(cate => cate == e.currentTarget.value)){
                setFilterCates(filterCates.filter(cate => cate != e.currentTarget.value));
            }
        }
    }
 
    let _setFilterBrand = (e) => {
        if(e.currentTarget.checked){
            if(!filterbrands.find(brand => brand == e.currentTarget.value)){
                setFilterBrand([...filterbrands,e.currentTarget.value]);
            }
        }else if(!e.currentTarget.checked){
            if(filterbrands.find(brand => brand == e.currentTarget.value)){
                setFilterBrand(filterbrands.filter((brand) => brand != e.currentTarget.value))
            }
        }
    };

    let _setFilterPrice = (e) => {
        if(e.currentTarget.checked){
            setFilterPrice([e.currentTarget.value]);
        }
    };

    useEffect(() => {
        let filters = {category_id: filterCates, brand_id: filterbrands, price_mode: filterprices};
        setFilters(filters);
    }, [filterCates, filterbrands, filterprices])

   
  return (
    <div className='my-online-shop-section section-color sidebar'>
        {
             categories.length > 0 &&
             <div className="row mb-5 p-3 products-sidebar-brand">
                 <div className="col-10 pb-1 mb-3">
                     <h5 className='section-title text-success mb-4'>Categories</h5>
                 </div>
                 {
                     categories.map((category,index) => 
                         <div className="col-md-6 mb-3 me-md-3 me-lg-0" key={index}>
                             <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="checkbox" name="brand_id"  value={category.id} onChange = {(e) => _setFilterCates(e)}/>
                                 <label className="form-check-label">
                                    {category.name}
                                 </label>
                             </div>
                         </div>
                     )
                 }
             </div>
        }
        {
             brands.length > 0 &&
            <div className="row mb-5 p-3 products-sidebar-brand">
                <div className="col-10 pb-1 mb-3">
                    <h5 className='section-title text-success mb-4'>Brands</h5>
                </div>
                {
                    brands.map((brand,index) => 
                        <div className="col-md-6 mb-3 me-md-3  me-lg-0" key={index}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="brand_id"  value={brand.id} onChange = {(e) => _setFilterBrand(e)}/>
                                <label className="form-check-label">
                                {brand.name}
                                </label>
                            </div>
                        </div>
                    )
                }
            </div>
        }
    
        <div className="row p-3 products-sidebar-price">
            <div className="col-10 pb-1 mb-3">
                <h5 className='section-title text-success mb-4'>Price</h5>
               
            </div>
            <div className="col-md-10 mb-3">
                <div className="form-check mb-3">
                    <input className="form-check-input" type="radio" name="filter-price" id="low-to-high" value="low-to-high" onChange={(e) => _setFilterPrice(e)}/>
                    <label className="form-check-label" htmlFor="low-to-high">
                        From Low To High 
                    </label>
                </div>
                <div className="form-check mb-3">
                    <input className="form-check-input" type="radio" name="filter-price" id="high-to-low" value="high-to-low" onChange={(e) => _setFilterPrice(e)}/>
                    <label className="form-check-label" htmlFor="high to low">
                        From High To Low
                    </label>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FilterBrand
