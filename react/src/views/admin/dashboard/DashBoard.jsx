import React, { useState, useEffect } from 'react'
import { Link, } from 'react-router-dom';
import axiosClient from '../../../axiosClient';

const DashBoard = () => {

  const [orders, setOrders] = useState({});
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDashboard();
  }, [])
  
  const getDashboard = async() => {
    setLoading(true);
    await axiosClient.get('/admin/dashboard')
    .then(res => {
        if(res && res.status == 200){
          setLoading(false);
          let { orders, products, users } = res.data;
          setOrders(orders);
          setProducts(products);
          setUsers(users);

        }
    })
    .catch(err => {
      setLoading(false);
      console.error(err);
    })

  }

  return (
    <div className='row my_online_shop_section p-3'>
        <div className="col-12 px-0 pb-1" style={{borderBottom: "2px solid green"}}>
           <h2>DashBoard</h2>
           <h6>Your analytics dashboard template</h6>
        </div>
        {
        !loading ?
          <>
            <div className="col-12 px-0 pt-4 pb-5" style={{borderBottom: "2px solid green"}}>
              <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4'>
                <div className="col">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Orders</h5>
                      <h3>{orders.total}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>   
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5 className="card-title">Today Orders</h5>
                      <h3>{orders.day}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>   
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <h5 className="card-title">This Month Orders</h5>
                      <h3>{orders.month}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>    
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-danger text-white">
                    <div className="card-body">
                      <h5 className="card-title">This Year Orders</h5>
                      <h3>{orders.year}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>     
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 px-0 pt-4 pb-5" style={{borderBottom: "2px solid green"}}>
              <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4'>
                <div className="col">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Categories</h5>
                      <h3>{products.categories}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>     
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5 className="card-title">Today Brands</h5>
                      <h3>{products.brands}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>     
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Colors</h5>
                      <h3>{products.colors}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>   
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-danger text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Products</h5>
                      <h3>{products.products}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>  
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 px-0 pt-4 pb-5" style={{borderBottom: "2px solid green"}}>
              <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4'>
                <div className="col">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <h5 className="card-title">All Users</h5>
                      <h3>{users.all}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>     
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Admins</h5>
                      <h3>{users.admins}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>     
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Users</h5>
                      <h3>{users.users}</h3>
                      <Link to="/admin/orders" className="admin-view-more-box"><div className="admin-view-more"><span>View all</span><i className="bi bi-chevron-right"></i></div></Link>     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        :
          <div className="d-flex justify-content-center py-5 w-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }   
    </div>
  )
}

export default DashBoard
