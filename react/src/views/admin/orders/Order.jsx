import React, {useState, useEffect, useRef} from 'react'
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../../../axiosClient';
//import ReactToPrint from 'react-to-print';
import SendInvoice from '../../../components/admin/SendInvoice';

const Order = () => {

    let { order_id } = useParams();
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const statusMessageRef = useRef();
    
    useEffect(() => {
        getOrder();
        return () => {
            setRefresh(false);
        }
    }, [refresh]);
    
    const getOrder = async() => {
        setLoading(true);
        await axiosClient.get(`/admin/order/${order_id}`)
        .then(res => {
            if(res && res.status == 202){
                setLoading(false);
                setOrder(res.data.order);
                setOrderItem(res.data.orderItems);
            }
        })
        .catch(err => {
            if(err){
                setLoading(false);
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
            photo = `${import.meta.env.VITE_API_BASE_URL}/uploads/admin/products/thumbnails/` + image;
            }
        }else{
            photo = "../uploads/no_img.jpg";
        }
        return photo;
    };

    const updateStatusMessage = async(e) => {
        e.preventDefault();
        let orderMessage = new FormData();
        orderMessage.append('status_message', statusMessageRef.current.value);
        await axiosClient.post(`/admin/order/edit/${order_id}`, orderMessage)
        .then(res => {
            if(res && res.status == 202){
                console.log(res.data);
                setError("");
                setMessage(res.data.message);

                setTimeout(() => {
                    setMessage("");
                    setRefresh(true);
                }, 2000);
            }
        })
        .catch(err => {
            if(err.response.status == 404){
                setError(err.response.data.error);
                setMessage("");
            }
        });
    }

    let order_data = "";
    if(loading){
        order_data = (
            <>
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>  
                </div>
            </>
        );
    }else{   
        order_data = (
            <>
            <div className="d-flex justify-content-between border-bottom pb-1 mb-5">
                <h5><span></span>Order Detail</h5>
                <div className="d-flex justify-content-around">
                    <SendInvoice order_id={order_id}/>
                    <Link className="btn btn-warning me-3" to={`${import.meta.env.VITE_API_BASE_URL}/view-invoice/${order_id}`} target='_blank'><i className="bi bi-eye"></i> View Invoice</Link>
                    <Link className="btn btn-primary" to={'/admin/orders'}>Back</Link>
                </div>
            </div>
            <div className='generatePDF p-5'>
                <div className='row row-cols-1 row-cols-md-2 g-5'>
                    <div className="col">
                        <h5>Detail</h5>
                        <hr className='w-100'/>
                        <h6>Order Id: <span>{order.id}</span></h6>
                        <h6>Tracking Id/No.: <span>{order.tracking_no}</span></h6>
                        <h6>Payment Mode: <span>{order.payment_mode}</span></h6>
                        <h6 className="border p-2 text-success">
                            Order Status: <span className="text-uppercase">{order.status_message}</span>
                        </h6>
                    </div>
                    <div className="col">
                        <h5>User</h5>
                        <hr className='w-100'/>
                        <h6>Full Name: <span>{order.full_name}</span></h6>
                        <h6>Email: <span>{order.email}</span></h6>
                        <h6>Phone: <span>{order.phone_number}</span></h6>
                        <h6>Address: <span>{order.address}</span></h6>
                        <h6>Zip code: <span>{order.zip_code}</span></h6>  
                    </div>
                    <br className='col-12'/>
                    <div className="col-md-12 mt-5 p-3">
                        <h5>Orders Items</h5>
                        <hr />
                        <table className="table table-striped table-hover table-bordered table-responsive align-middle text-center">
                            <thead>
                                <tr>
                                <th scope="col">Item Id</th>
                                <th scope="col">Image</th>
                                <th scope="col">Product</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {
                                    orderItems.length > 0 &&
                                    orderItems.map((orderItem, index) => 
                                    
                                        <tr key={index}>
                                            <td scope="col">{orderItem.id}</td>
                                            <td scope="col">
                                                <img src={createImage(orderItem.product.product_image.image_thumbnail)} alt="order_iten_img" style={{width:"80px"}}/>
                                            </td>
                                            <td scope="col">
                                                {orderItem.product.name}
                                                {
                                                    orderItem.product_color_id && (<p>( {orderItem.product_color.color.name} )</p>)
                                                }
                                            </td>
                                            <td scope="col">{orderItem.price}</td>
                                            <td scope="col">{orderItem.quantity}</td>
                                            <td scope="col">{orderItem.price * orderItem.quantity}</td>
                                        </tr>
                                    
                                    )
                                } 
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div>
                {
                    message && 
                    <div className="col-12" style={{borderLeft: "6px solid #04AA6D", backgroundColor: "#ddffdd"}}>
                        <p className='p-1'><strong className='text-success'>Success!</strong> {message ? message:""}</p>
                    </div> 
                }
                {  
                    error &&
                    <div className="col-12" style={{borderLeft: "6px solid #ffeb3b", backgroundColor: "#ffffcc"}}>
                        <p className='p-1'><strong className='text-danger'>Warning! </strong> {error ? error:""}</p>
                    </div> 
                }
            </div> 
            <div className="col-md-12 mt-5">
                <div className="card shadow p-0">
                    <div className="card-body">
                        <div className="d-flex justify-content-between border-bottom pb-1 mb-5">
                            <h5><span></span>Order Process (Current Order Status Update)</h5>
                        </div>
                        <div className="row">
                            <div className="col-md-5 mb-3">
                                <form>
                                    <label><h6 className="mb-3">Update Current Order Status</h6></label> 
                                    <div className="input-group">
                                        <select className="form-select" ref={statusMessageRef}>
                                            <option value="">Select a Order Status</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                        </select>
                                        <button type='button' className='px-3' onClick={(e) => updateStatusMessage(e)}>Update Status</button>
                                    </div>
                                </form>    
                            </div>
                            <div className="col-md-7 text-md-center">
                                <br/>
                                <h6 className="mt-md-3">Current Order Status: <span className="text-success">{order.status_message}</span></h6>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        ) 
    }
    
  return (
    <div className='p-5 my-online-shop-section shadow'>
        {
            order_data
        }
    </div>
  )
}

export default Order