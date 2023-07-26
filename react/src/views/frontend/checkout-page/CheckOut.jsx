import React,{ useState, useRef, useMemo } from 'react';

import MainLayout from '../../../components/frontend/layout/MainLayout';
import { useCartContext } from '../../../contexts/CartContext';
import axiosClient from '../../../axiosClient';
import Paypal from '../../../components/frontend/Paypal';
import { useNavigate } from 'react-router-dom';


const CheckOut = () => {

    let cart = useCartContext();
    let navigate = useNavigate();

    const [checkout, setCheckout] = useState({
        full_name:"",
        phone_number:"",
        email:"",
        zip_code:"",
        address:"",
        payment_mode:"",
        payment_id:"",
    });

    const _setCheckOut = (e) => {
        e.preventDefault();
        setCheckout({...checkout, [e.target.name]: e.target.value})
    }

    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading]         = useState(false);
    const [payment, setPayment]         = useState(false);

    const handlePaymentModal = () => {
        setShowPayment(() => !showPayment);
    };

    const [erros, setErrors] = useState({
        full_name:[],
        phone_number:[],
        email:[],
        zip_code:[],
        address:[],
    });

    const submitCheckout = async(e, action) => {
        e.preventDefault();
        setLoading(true);

        switch (action) {
            case 'cash on delivery':
                checkout.payment_mode = 'cash on delivery';
                await axiosClient.post('/order/add', checkout)
                .then(res => {
                if(res){      
                    if(res.status == 201){
                        setLoading(false);
                        setErrors({
                            full_name:[],
                            phone_number:[],
                            email:[],
                            zip_code:[],
                            address:[],
                        });

                        setCheckout({...checkout, ...{ 
                            full_name:"",  
                            phone_number:"", 
                            email:"", zip_code:"", 
                            address:"",   payment_mode:"", 
                            payment_id:"", 
                        }});

                        toast.fire({
                            icon: 'success',
                            text: res.data.feedback,
                        });

                        cart.setRefresh(true);

                        navigate('/cart/checkout/thankyou');
                    } 
                }
                })
                .catch(err => {
                    if(err){
                        setLoading(false);
                        if(err.response){
                            let {errors} = err.response.data;

                            if(err.response.status == 422){
                                setErrors({...erros, ...errors});
                            }else if(err.response.status == 401){
                                toast.fire({
                                    icon: 'error',
                                    text: err.response.data.message,
                                })
                            }
                        }
                    }
                })    
            
            break;
            case 'pay by paypal':
                await axiosClient.post('/order/validate', checkout)
                .then(res => {
                    if(res){
                        if(res.status == 201){
                            setLoading(false);
                            setErrors({
                                full_name:[],
                                phone_number:[],
                                email:[],
                                zip_code:[],
                                address:[],
                            });

                            if(!showPayment){
                                handlePaymentModal();
                                setPayment(true);
                            }
                           
                        }
                    }
                })
                .catch(err => {
                    if(err){
                        setLoading(false);
                        if(err.response){
                            let {errors} = err.response.data;
                            if(err.response.status == 422){
                            setErrors({...erros, ...errors});
                            }else if(err.response.status == 401){
                                toast.fire({
                                    icon: 'error',
                                    text: err.response.data.message,
                                })
                            }
                        }
                    }
                })  
            break;
        }
    }

    let cart_data = "";
    if(cart.loading){
        cart_data = (
        
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
    }else{
        if(cart.carts.length > 0){
            cart_data = (
                <div className='my-online-shop-section'>
                    <div className="row">
                        <div className="col-lg-7 col-12 mb-5 mb-lg-0">
                            <div className="card shadow card-box">
                                <div className="card-header p-3">
                                    <h3 className='text-primary'>Basic Infomation</h3>
                                </div>
                                <div className="card-body">
                                    <form className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Full name</label>
                                            <input type="text" className="form-control" name='full_name' value={checkout.full_name} onChange={(e) => _setCheckOut(e)}/>
                                            {
                                                erros.full_name.length > 0 ? erros.full_name.map((err, index) => <small className='text-danger' key={index}>{err}</small>):""
                                            }
                                        
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Phone number</label>
                                            <input type="text" className="form-control" name='phone_number' value={checkout.phone_number} onChange={(e) => _setCheckOut(e)}/>
                                            {
                                                erros.phone_number.length > 0 ? erros.phone_number.map((err, index) => <small className='text-danger' key={index}>{err}</small>):""
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email Address</label>
                                            <input type="text" className="form-control" name='email' value={checkout.email} onChange={(e) => _setCheckOut(e)}/>
                                            {
                                                erros.email.length > 0 ? erros.email.map((err, index) => <small className='text-danger' key={index}>{err}</small>):""
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Zip code</label>
                                            <input type="text" className="form-control" name='zip_code' value={checkout.zip_code} onChange={(e) => _setCheckOut(e)}/>
                                            {
                                                erros.zip_code.length > 0 ? erros.zip_code.map((err, index) => <small className='text-danger' key={index}>{err}</small>):""
                                            }
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Full address</label>
                                            <textarea className="form-control" name="address" cols="5" rows="5" value={checkout.address} onChange={(e) => _setCheckOut(e)}></textarea>
                                            {
                                                erros.address.length > 0 ? erros.address.map((err, index) => <small className='text-danger' key={index}>{err}</small>):""
                                            }
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex align-items-start">
                                                <div className="row">
                                                    <div className="col-sm-5 mb-3">
                                                        <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                            <button className="nav-link active" id="v-pills-cash-tab" data-bs-toggle="pill" data-bs-target="#v-pills-cash" type="button" role="tab" aria-controls="v-pills-cash" aria-selected="true" style={{minWidth: "160px"}}>
                                                                Cash On Delivery
                                                            </button>
                                                            <button className="nav-link" id="v-pills-online-tab" data-bs-toggle="pill" data-bs-target="#v-pills-online" type="button" role="tab" aria-controls="v-pills-online" aria-selected="false" style={{minWidth: "160px"}}>
                                                                Online Payment
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <div className="tab-content border shadow p-3" id="v-pills-tabContent">
                                                            <div className="tab-pane fade show active" id="v-pills-cash" role="tabpanel" aria-labelledby="v-pills-cash-tab" tabIndex="0">
                                                                <div className="row">
                                                                    <div className="col-12 mb-3 text-center">
                                                                        Cash on Delivery Mode
                                                                    </div>
                                                                    <div className="col-12 text-center">

                                                                        {
                                                                            loading ?
                                                                            <button className="btn btn-success" type="button" disabled>
                                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                                Loading...
                                                                            </button>
                                                                            :
                                                                            <button className='btn btn-success' type='button' onClick={(e) => submitCheckout(e, 'cash on delivery')}>Place order(Cash on Delivery)</button>
                                                                        } 
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane fade" id="v-pills-online" role="tabpanel" aria-labelledby="v-pills-online-tab" tabIndex="0">
                                                                <div className="row">
                                                                    <div className="col-12 mb-3 text-center">
                                                                        Online Payment Mode
                                                                    </div>
                                                                    <div className="col-12 text-center">

                                                                        {
                                                                            loading ?
                                                                            <button className="btn btn-success" type="button" disabled>
                                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                                Loading...
                                                                            </button>
                                                                            :
                                                                            <button className='btn btn-success' type='button' onClick={(e) => submitCheckout(e, 'pay by paypal')}>Pay now(Online Payment)</button>
                                                                        } 
                                                                      
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 col-12">
                            <div className="card shadow w-100 p-3 pb-0 card-box">
                                <table className="table table-responsive align-middle table-bordered">
                                    <thead>
                                        <tr className='text-center'>
                                            <th scope="col">Product</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            cart.carts.length > 0 &&
                                            cart.carts.map((cart, index) => 
                                                <tr key={index} className='text-end'>
                                                    <td>{cart.product.name}{cart.product_color_id ? `, ${cart.product_color.color.name}`:""}</td>
                                                    <td>
                                                        {
                                                            cart.product.sell_price ? cart.product.sell_price: cart.product.price
                                                        }
                                                    </td>
                                                    <td>{cart.quantity}</td>
                                                    <td>{cart.product.sell_price ? cart.product.sell_price: cart.product.price * cart.quantity}</td>
                                                </tr>
                                            )
                                        }
                                    
                                        <tr>
                                            <td colSpan={3} className="text-end text-primary"><h5>Grand Total</h5></td>
                                            <td className='ps-3 text-end fw-medium'>{cart.totalCost}$</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) 
        }else{
        cart_data = (
            <div className="p-5 my-online-shop-section">
                <div className="shadow">
                    <h3>Your Cart is Empty</h3>
                </div>
            </div>
        ) 
        }
    } 
    
    return (
       
        <MainLayout>
            {/* Online Payment Modal */}
         
                <Paypal payment={payment} setPayment={setPayment} checkout={checkout} setCheckout={setCheckout} showPayment={showPayment} handlePaymentModal={handlePaymentModal}/>
                        
            {/* End Online Payment Modal */}

            {cart_data}
        </MainLayout>
    )
}

export default CheckOut


