import React from 'react'
import { useProductContext } from '../../../contexts/product/ProductContext';

const ImageProduct = ({image_thumbnail, setImage_thumbnail, image_gallary, setImage_gallary}) => {

 
    const addImageThumbnail = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        let size = file['size'];
        let limit = 2*1024*1024;
        let reader = new FileReader();
        if(!file){
            return false;
        }else{
            if(limit < size) {
                alert("File too large");
                return false;
            }else{
                reader.onloadend = (file) => {
                    setImage_thumbnail(reader.result)
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const addImageGallary = (e) => {
        e.preventDefault();
        let files = e.target.files;
        if(files.length <= 0){
            return false;
        }else{
            let limit = 2*1024*1024;
            let gallary = [];
            for(let i = 0; i < files.length; i++){
                if(limit < files[i].size) {
                    toast.fire({
                        icon: 'error',
                        text: `File is too large`,
                    });
                    return false;
                }else{
                    let reader = new FileReader();
                    reader.onloadend = () => {
                        gallary[i] = {id:i + 1, url: reader.result};
                        setImage_gallary(gallary);
                    };
                    reader.readAsDataURL(files[i]);
                }
            }

        }
    };

    const changeImage = (e, index) => {
        e.preventDefault();
        let file = e.target.files[0];
        let size = file['size'];
        let limit = 2*1024*1024;
        let reader = new FileReader();
        if(!file){
            return false;
        }else{
            if(limit < size) {
                toast.fire({
                    icon: 'error',
                    text: `File is too large`,
                });
                return false;
            }else{
                reader.onloadend = (file) => {
                    setImage_gallary(image_gallary.map((image) => image.id == index ? {...image,url:reader.result}:image))
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const deleteImage = (e, index) => {
        e.preventDefault();
        setImage_gallary(image_gallary.filter((image,i) => image.id != index));
    }

    const addMoreImage = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        let size = file['size'];
        let limit = 2*1024*1024;
        let reader = new FileReader();
        if(!file){
            return false;
        }else{
            if(limit < size) {
                toast.fire({
                    icon: 'error',
                    text: `File is too large`,
                });
                return false;
            }else{
                reader.onloadend = (file) => {
                    setImage_gallary([...image_gallary,{id: image_gallary.length + 1, url:reader.result}]);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    const createImageGallary = (image) => {
        let photo = "";
        if(image){
            if(image.indexOf('base64') !== -1){
                photo = image
            }else{
                photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/products/gallarys/` + image;
            }
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
        }
        return photo;
    };

    const createImageThumb = (image) => {
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

  return (
    <div className="row">
        <div className="col-12 mb-5">
            <div className="card w-100 shadow my_online_shop_component">
                <div className="card-header">
                    <h5>Product Image Thumbnail</h5>
                </div>
                <div className="card-body">
                    <div className="add-image-box">
                        <div className="add-image-name">
                            <img src={createImageThumb(image_thumbnail)} alt="product_img" />
                        </div> 
                        <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="form-control" id="image-input" onChange={(e) => addImageThumbnail(e)}/>
                    </div> 
                </div>
            </div>
        </div> 
        <div className="col-12 mb-5">
            <div className="card w-100 shadow my_online_shop_component">
                <div className="card-header">
                    <h5>Product Image Gallary</h5>
                </div>
                <div className="card-body">
                    {
                        image_gallary.length > 0 ?
                        <>
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-6 g-4 mb-5 mt-3">
                            {
                                image_gallary.map((image, index) => 
                                <div className="col" key={index}>
                                    <div className="add-image-box">
                                        <div className="add-image-name">
                                            <img src={createImageGallary(image.url)} alt="product_img" />
                                        </div> 
                                        <input type="file" multiple accept="image/png, image/jpeg, image/jpg, image/webp" className="form-control" id="image-input" onChange={(e) => changeImage(e, image.id)}/>
                                        <div className="delete-image-btn" onClick={(e) => deleteImage(e, image.id)}><span><i className="bi bi-x"></i></span></div>
                                    </div>
                                </div>)
                            }
                            </div>
                            <button className="btn btn-outline-success add-more-image-to-gallary">Add More Image to Gallary
                                <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="form-control" id="image-input" onChange={(e) => addMoreImage(e)}/>
                            </button>
                        </>
                        
                        :
                        <div className="add-image-box">
                            <div className="add-image-name"><img src={createImageGallary("")} alt="product_img" /></div> 
                            <input type="file" multiple accept="image/png, image/jpeg, image/jpg, image/webp" className="form-control" id="image-input" onChange={(e) => addImageGallary(e)}/>
                        </div>
                    }
                    
                </div>
            </div>
        </div>                                               
    </div>     
  )
}

export default ImageProduct