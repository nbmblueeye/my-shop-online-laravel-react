import React from 'react';

const Category = ({ categories, loading, scrollToCategory}) => {

   const createImage = (image) => {
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
            <div className='row g-2 p-3'>
            {
                categories.length > 0 ?
                categories.map((category, index) =>
                <div className="col-md-3 col-lg" key={index} >
                    <div className="card card-box" onClick={() => scrollToCategory(category.id)}>
                        <div className="card_container">
                            <img src={createImage(category.image)} className="card-img-top rounded" alt="category_img"/>
                            <div className="category_card_overlay">
                                <h5>{category.name}</h5>
                                <span className='text-primary'><i className="bi bi-chevron-down fs-5"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                )
                :
                <div className="card w-100"> 
                    <div className="card-body">
                        <div className="d-flex justify-content-center py-5">
                            <div className="text-primary">
                                <h5>There're no Category Available</h5>
                            </div>
                        </div>
                    </div>
                </div>    
            } 
            </div>  
       )
   }  

  return (
    <div className='my-online-shop-section archive-page-category shadow' style={{marginBottom:"6rem"}}>
        {output}
    </div>
  )
}

export default Category
