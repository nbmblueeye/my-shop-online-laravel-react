import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import axiosClient from '../../../axiosClient';
import { Link } from 'react-router-dom';

const OrderPage = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const createDate = (input) => {
    let date = new Date(input);
    return date.toLocaleString();
  }

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async() => {
       setLoading(true);
       await axiosClient.get('/orders')
       .then(res => {
           if(res && res.status == 201){
               setLoading(false);
               setOrders(res.data.orders);
           }
       })
       .catch(err => {
           if(err){
               setLoading(false);
               console.log(err);
           }
       })
  }

  let order_data = "";
    if(loading){
      order_data = (
              <div className='p-5 my-online-shop-section'>
                <div className="row">
                  <div className="col-12">
                    <div className="card shadow card-box">
                      <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                      </div> 
                    </div>
                  </div>
                </div>
              </div>
            );

    }else{
        if(orders.length > 0){
            order_data = (
                <div className='p-5 my-online-shop-section'>
                    <div className="row">
                        <div className="col-12 mb-5 mb-lg-0">
                            <div className="card shadow card-box">
                                <div className="card-header p-3">
                                    <h3 className='text-primary'>Your Order</h3>
                                </div>
                                <div className="card-body">
                                  <table className="table table-striped table-hover table-responsive align-middle text-center cell-border">
                                      <thead>
                                          <tr>
                                              <th scope="col">Order ID</th>
                                              <th scope="col">Tracking No</th>
                                              <th scope="col">Username</th>
                                              <th scope="col">Payment Mode</th>
                                              <th scope="col">Ordered Date</th>
                                              <th scope="col">Status Message</th>
                                              <th scope="col">Action</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {
                                            orders.map((order, index) =>
                                              <tr key={index}>
                                                  <td>{order.id}</td>
                                                  <td>{order.tracking_no}</td>
                                                  <td>{order.full_name}</td>
                                                  <td>{order.payment_mode}</td>
                                                  <td>{createDate(order.created_at)}</td>
                                                  <td>{order.status_message}</td>
                                                  <td><Link to={`/orders/order/${order.id}`}>View Detail</Link></td>
                                              </tr>
                                            )
                                          }
                                      </tbody>
                                  </table>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
            ) 
        }else{
          order_data = (
                <div className='p-5 my-online-shop-section'>
                  <div className="row">
                    <div className="col-12">
                      <div className="card shadow card-box">
                        <div className="card-body text-center py-5">
                          <h5>There're No Order available</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          ) 
        }
    } 

  return (
    <MainLayout>
        {order_data}
    </MainLayout>
  )

}

export default OrderPage