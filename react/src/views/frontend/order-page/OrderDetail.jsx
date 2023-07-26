import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../../../axiosClient';
import MainLayout from '../../../components/frontend/layout/MainLayout';

const OrderDetail = () => {

    let {order_id} = useParams();

    const [order, setOrder] = useState({});
    const [orderItems, setOrderItem] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      getOrder();
    }, []);
  
    const getOrder = async() => {
        setLoading(true);
        await axiosClient.get(`/order/${order_id}`)
        .then(res => {
            if(res && res.status == 201){
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
  
    let order_data = "";
    if(loading){
        order_data = (
            <div className='p-5 my-online-shop-section'>
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>  
                </div>
            </div>
        );
    }else{   
        order_data = (
            <div className='p-5 my-online-shop-section'>
                <div className='row row-cols-1 row-cols-md-2 g-5'>
                    <div className="col">
                        <h5>Order Detail</h5>
                        <hr className='w-100'/>
                        <h6>Order Id: <span>{order.id}</span></h6>
                        <h6>Tracking Id/No.: <span>{order.tracking_no}</span></h6>
                        <h6>Payment Mode: <span>{order.payment_mode}</span></h6>
                        <h6 className="border p-2 text-success">
                            Order Status: <span className="text-uppercase">{order.status_message}</span>
                        </h6>
                    </div>
                    <div className="col">
                        <h5>User Detail</h5>
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
                                            <td scope="col">Total</td>
                                        </tr>
                                    
                                    )
                                }
                                  
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ) 
    }
    

  return (
    <MainLayout>
        {order_data}
    </MainLayout>
  )

}
export default OrderDetail