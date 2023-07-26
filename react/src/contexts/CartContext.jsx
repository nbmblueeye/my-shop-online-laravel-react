import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axiosClient from '../axiosClient';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './Auth/UserContext';


const Cart_Context = createContext({
    quantity:1,
    handleQuantity:()=>{},
    cartAction: false,
    addProductToCart:()=>{},
    carts:[],
    setCarts:()=>{},
    setRefresh:false,
    loading:false,
    setLoading:()=>{},
    totalCost:0,
});

export const useCartContext = () => {
    return useContext(Cart_Context);
};

const CartContext = ( { children }) => {

  const { token } = useUserContext();
  const [carts, setCarts] = useState([]);
  const [expense, setExpense] = useState([]);
  
  const navigated = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [cartAction, setCartAction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if(token){
      getCarts();
    }
    return () => {
      setRefresh(false);
    }
  }, [refresh])

  const getCarts = async() => {
    setLoading(true);
    
    await axiosClient.get('/carts')
    .then(res => {
        if(res && res.status == 201){
          setLoading(false);
          setCarts(res.data.carts);

          let newExpense = [];
          res.data.carts.map((cart, index) => {
            newExpense.push(cart.product.sell_price ? cart.product.sell_price * cart.quantity: cart.product.price * cart.quantity)
          });
          setExpense(newExpense);
        }
    })
    .catch(err => {
        if(err){
            setLoading(false);
            console.log(err);
        }
    })
  }

  const handleQuantity = (action) => {
    if(action == 'decrease'){
        if(quantity > 1){
            setQuantity(() => quantity - 1);
        }
    }else if(action == 'increase'){
        if(quantity <= 9){
            setQuantity(() => quantity + 1);
        }
    }
  }

  const addProductToCart = async(e, product_id, product_color_id) => {
    e.preventDefault();
    setCartAction(true);
    let product_data = new FormData();

    product_data.append("product_id", product_id);
    product_data.append("product_color_id", product_color_id);
    product_data.append("quantity", quantity);

    await axiosClient.post('/cart/product/add', product_data)
    .then(res => {
      if(res){
        if(res.status == 201){
          setCartAction(false);
          toast.fire({
            icon: 'success',
            text: res.data.feedback,
          });
        }
        setRefresh(true);
      }
    })
    .catch(err => {
      if(err){
        setCartAction(false);
        console.log(err);
        if(err.response.status == 401){
          toast.fire({
            icon: 'error',
            text: err.response.data.message,
          });
          navigated('/login');
        }else if(err.response.status == 404){
          toast.fire({
            icon: 'error',
            text: err.response.data.feedback,
          })
        }else if(err.response.status == 405){
          toast.fire({
            icon: 'error',
            text: err.response.data.feedback,
          })
        }else if(err.response.status == 406){
          toast.fire({
            icon: 'error',
            text: err.response.data.feedback,
          })
        }
      }
    })

  };

  let totalCost = useMemo(() => expense.reduce((acc, item) =>{ return acc + item }, 0), [carts])

  let data = {
    quantity,
    handleQuantity,
    cartAction,
    addProductToCart,
    carts,
    setCarts,
    loading,
    setLoading,
    setRefresh,
    totalCost,
  }

  return (
    <Cart_Context.Provider value={data}>
        {children}
    </Cart_Context.Provider>
  )
}

export default CartContext