import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../axiosClient';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import LPagination from '../../../components/LPagination';


const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState({});
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [filter, setFilter] = useState({
        date:"",
        status: "",
    });
    
    const _setFilter = (e) => {
        e.preventDefault();
        setFilter({...filter, [e.target.name]: e.target.value});
    }

    useEffect(() => {
        getOrders();
        return () => {
          setRefresh(false);
        }
    }, [refresh, filter]);

    const onPaginate = (url) => {
        getOrders(url);
    }

    const getOrders = async(link) => {
        setLoading(true);
        let url = link ? link:'/admin/orders'; 
        await axiosClient.get(url,{params:filter})
        .then(res => {
            if(res && res.status == 202){
                setLoading(false);
                setOrders(res.data.orders.data);
                setItems(res.data.orders);
            }
        })
        .catch(err => {
            if(err){
                setLoading(false);
                console.log(err);
            }
        })
    }
   
   const createDate = (input) => {
        let date = "";
        if(input){
            date = new Date(input);
            return date.toLocaleDateString();
        }else{
            date = new Date();
            return date.toLocaleDateString('en-CA');
        }
    }
    
    let order_data = "";
    if(loading){
      order_data = (
               <tr>
                    <td colSpan="7" className='py-5'>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </td>
                </tr>
            );
    }else{
        if(orders.length > 0){
            order_data = orders.map((order, index) =>
                    <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.tracking_no}</td>
                        <td>{order.full_name}</td>
                        <td>{order.payment_mode}</td>
                        <td>{createDate(order.created_at)}</td>
                        <td>{order.status_message}</td>
                        <td>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                    View Detail
                                    </Tooltip>
                                }
                                >
                                <Link to={`/admin/order/${order.id}`}>
                                    <div className="edit btn btn-outline-warning">
                                        <i className="bi bi-ticket-detailed"></i>
                                    </div>
                                </Link>
                            </OverlayTrigger>
                        </td>
                    </tr>)                
        }else{
          order_data = (        
                <tr>
                    <td colSpan="7" className='py-5'>
                        <h5>There're No Order available</h5>
                    </td>
                </tr>           
          ) 
        }
    }
  
    return (
        <div className='p-5'>
            <div className="row">
                <div className="col-12 mb-5 mb-lg-0">
                    <div className="card shadow my_online_shop_section">
                        <div className="card-header">
                            <h3 className='text-primary'>Your Order</h3>
                        </div>
                        <div className="card-body">
                            <div className="row mb-5 px-3">
                                <div className="col-3">
                                    <label  className="form-label">Filter By Date</label>
                                    <input type="date" className="form-control" name='date' value={filter.date} onChange={(e) => _setFilter(e)}/>
                                </div>
                                <div className="col-3">
                                    <label  className="form-label">Filter By Status</label>
                                    <select className="form-select" value={filter.status} name='status' onChange={(e) => _setFilter(e)}>
                                        <option value="">All Status</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                    </select>
                                </div>
                            </div>
                            <table className="table table-responsive align-middle text-center cell-border my_online_shop_component">
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
                                        order_data
                                    }
                                </tbody>
                            </table>
                            {
                            items.total > 10 &&
                            <div className="d-flex justify-content-end mt-5 me-5">
                            <LPagination items={items}  onPaginate={onPaginate}/>
                            </div>
                        }
                        </div>
                    </div>
                </div>
            
            </div>
        </div>
    )
}

export default Orders