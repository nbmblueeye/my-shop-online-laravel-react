import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axiosClient from '../../axiosClient';
import { useCartContext } from '../../contexts/CartContext';


const Paypal = ( {payment, setPayment, checkout, setCheckout, showPayment, handlePaymentModal} ) => {

    const cart  = useCartContext();
  
    const [feedback, setFeedBack] = useState({
      error:null,
      message:null,
    });

    const paypalRef= useRef();
    useEffect(() => {
        if(payment){
          window.paypal.Buttons({   
            async createOrder(){
              // Order is created on the server and the order id is returned
             return await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/create-paypal-order`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                // use the "body" param to optionally pass additional order information
                // like product skus and quantities
                body: JSON.stringify({totals: cart.totalCost}),
               
              }).then(response => response.json())
                .then(data => {
                  if(data.error){
                    setFeedBack({...feedback, ...{error: data.error.details[0].description, message:""}});
                  }else{
                    setFeedBack({...feedback, ...{error: "", message:data.status}});
                  }
                  return data.id
                })
                .catch(errors => {
                  setFeedBack({...feedback, ...{error: errors, message:""}});
                  console.log(errors);
                });
              
            }, 
            async onApprove(data) {
              // Order is captured on the server
            return await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/capture-paypal-order`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    orderID: data.orderID
                  })
              })
              .then(response => response.json())
              .then(orderData => {
                setFeedBack({...feedback, ...{error: "", message:(
                  <span>
                    Thank you for your Payment, Mr <span>{orderData.payer_name.given_name}</span>
                    <br />
                    Total Value: {orderData.payment_info.value} {orderData.payment_info.currency_code}
                  </span>
                  )}
                });
                checkout.payment_mode = 'pay by paypal';
                checkout.payment_id   = orderData.payment_id;
                axiosClient.post('/order/add', checkout)
                .then(res => {
                if(res){      
                    if(res.status == 201){
                        setCheckout({...checkout, ...{ 
                            full_name:"",  
                            phone_number:"", 
                            email:"", 
                            zip_code:"", 
                            address:"",   
                            payment_mode:"", 
                            payment_id:"", 
                        }});

                        cart.totalCost = 0;
                        setTimeout(() => {
                          cart.setRefresh(true);
                          setPayment(false);
                          
                          navigate('/cart/checkout/thankyou');
                        }, 3000);
                    } 
                  }
                })    
                
              })
              .catch(error => {
                console.log(error);
              });
            }
          }).render(paypalRef.current);
        };
    }, [payment])
       
  return (
    <>
         <Modal
                show={showPayment}
                onHide={handlePaymentModal}
                backdrop="static"
                aria-labelledby="contained-modal-title-center"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {
                    feedback.error ?
                    <div className="my_online_shop_message">
                      <div className='danger text-danger'>
                        <p><strong>Danger!</strong> {feedback.error}</p>
                      </div>
                    </div>
                    :
                    ""
                  }
                  {
                    feedback.message ?
                    <div className="my_online_shop_message">
                      <div className="success text-success">
                          <p><strong>Success!</strong> {feedback.message}</p>
                      </div>
                    </div>
                    :
                    ""
                  }
                    <div ref={paypalRef}></div>
                </Modal.Body>
            </Modal>
            
            
    </>
  )
}

export default Paypal