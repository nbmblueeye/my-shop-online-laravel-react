import React, { createContext, useContext, useState, useEffect} from 'react';
import axiosClient from '../../axiosClient';

const Product_Context = createContext({
    colors:[],
    _setColors:() =>{},
    setColors:() =>{},
    u_colors:[],
    _setU_Colors:() =>{},
    setU_Colors:() =>{},
    createImage: () => {},
    color_products:[],
    setColor_Products:() =>{},
})

export const useProductContext = () => {
    return useContext(Product_Context)
}

const ProductContext = ({ children }) => {

    const [colors, setColors] = useState([]);
    const [u_colors, setU_Colors] = useState([]);
    const [color_products, setColor_Products] = useState([]);
   
    const _setColors = (colors) =>{
        if(colors.length > 0){
            let outputColors = colors.map((color) => {
                return {color_id:color.id, color_name:color.name, color_image:color.image, color_qty: 1, status:'unchecked'};
            });
            setColors(outputColors);
        }else{
            setColors([]);
        }
    }

    const _setU_Colors = (remainColors) => {
        if(remainColors.length > 0){
            let outputColors = remainColors.map((color) => {
                return {color_id:color.id, color_name:color.name, color_image:color.image, color_qty: 1, status:'unchecked'};
            });
            setU_Colors(outputColors);
        }
    };

    useEffect(() => {
        initProductData();
    }, [])
  
    const initProductData = async() => {
        await axiosClient.get('/admin/product-attributes')
        .then(res => {
          if(res && res.status == 200){
            let { colors } = res.data;
            _setColors(colors);
          }
        })
        .catch(err => {
            if(err){
              console.log(err);
            }
        })
    }

    const createImage = (image) => {
        let photo = "";
        if(image){
            if(image.indexOf('base64') !== -1){
                photo = image
            }else{
                photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/` + image;
            }
        }else{
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/no_img.jpg`;
        }
        return photo;
    };

    let data = {
        colors,
        _setColors,
        setColors,
        u_colors,
        _setU_Colors,
        setU_Colors,
        createImage,
        color_products,
        setColor_Products,
    }

  return (
     <Product_Context.Provider value={data}>
        {children}
     </Product_Context.Provider>
  )
}

export default ProductContext