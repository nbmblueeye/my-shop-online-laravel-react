import React, { useState } from 'react'
import { Link, useLocation, } from 'react-router-dom'
import { useUserContext } from '../../../contexts/Auth/UserContext'
import { useWishlistContext } from '../../../contexts/WishlistContext';
import { useCartContext } from '../../../contexts/CartContext';
import { useSettingContext } from '../../../contexts/SettingContext';
import Search from '../Search';
import SEO from '../SEO';


const HeadBar = () => {
  
  const [search, setSearch] = useState(false);
  const {token, user , userLogout} = useUserContext();
  const { settings }  = useSettingContext();
  let wishlist = useWishlistContext();
  let cart  = useCartContext();
  let locations =useLocation();

  const [navbar, setNavBar] = useState(false);
 
  return (
    <>
      <SEO title={ `Home ${settings.pageTitle ? " | " + settings.pageTitle:""}`} metaKeywords={settings.metaKeywords} metaDes={settings.metaDes}/>
      <div className="navbar-wrapper">
        <div className={`navbar-screen  ${navbar ? "active":"" }`} onClick={() => setNavBar(!navbar)}></div>
        <div className="my-online-shop-top-nav-bar bg-primary">
          <Link className="navbar-brand" to="/">{settings.websiteName}</Link>
          <div className={`navbar-search ${search ? "active":""}`}>
              <Search/>
          </div>
          <div className="top-nav-bar-menu-box">
            <li className="nav-item navbar-search-icon" onClick={() => setSearch(!search)}>
                <span className="nav-link"><i className="bi bi-search fs-5"></i></span>
            </li>
            <ul className="top-nav-bar-menu">  
              <li className="nav-item">
                <Link className={`nav-link ${locations.pathname == "/cart" ? 'active':""}`}  to="/cart"><i className="bi bi-cart3 fs-5"></i> Cart({cart.carts.length})</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${locations.pathname == "/wishlist" ? 'active':""}`}  to="/wishlist" ><i className="bi bi-heart-fill fs-5 text-danger"></i> Wishlist()</Link>
              </li>
              {
                !token ?
                (
                  <li><Link className="nav-link" to="/login"><span className='fs-4'><i className="bi bi-box-arrow-in-right"></i></span> Login</Link></li>
                )
                :
                (
                <li className="nav-item dropdown dropdown-start">
                  <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {
                      user.url? 
                      <img className='me-1' src={`${import.meta.env.VITE_API_BASE_URL}/uploads/admin/users/` + user.url} alt="avatar" width="25px" height="25px" style={{borderRadius:"50%"}}/>
                      :
                      <i className="bi bi-person-circle fs-5 me-1"></i> 
                    }
                    {user.user_name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" style={{maxWidth:"200px"}}>
                    <li>
                      {
                        user.user_name && 
                        user.role == "admin" ?
                        <Link className="dropdown-item" to="/admin"><span className='fs-4'><i className="bi bi-person-fill-gear"></i></span>  Admin</Link>
                        :
                        <a className="dropdown-item" href="/profile"><span className='fs-4'><i className="bi bi-person-lines-fill"></i></span> Your Profile</a>
                      }
                    </li>
                    <li><Link className="dropdown-item" to="/orders"><span className='fs-4'><i className="bi bi-box-arrow-in-right"></i></span> Your Order</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" onClick={(e) => userLogout(e)}><span className='fs-4'><i className="bi bi-box-arrow-in-right"></i></span> Logout</Link></li>
                    
                  </ul>
                </li>
                )
              }
              
            </ul>
            <button className={`nav-menu-toggle-btn btn ${navbar ? "btn-outline-info":"btn-outline-dark" } ms-3`} onClick={() => setNavBar(!navbar)}>
              <i className="bi bi-list fs-3"></i>
            </button> 
          </div>
        </div>
        <div className={`my-online-shop-bottom-nav-bar ${navbar ? "active":"" } bg-dark`}>
          <div className="bottom-nav-title">
              <Link className="navbar-brand" to="/"><h3>{settings.websiteName}</h3></Link>
              <div className="nav-close-btn" onClick={() => setNavBar(!navbar)}><i className="bi bi-x-lg"></i></div>
          </div>
          <ul className="bottom-nav-bar-menu">
              <li className="nav-item">
                <Link className={`nav-link ${locations.pathname == "/home" ? 'active':""}`} aria-current="page" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${locations.pathname == "/categories" ? 'active':""}`} to="/categories">All Categories</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${locations.pathname == "/new-arrivals" ? 'active':""}`} to="/new-arrivals">New Arrirals</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${locations.pathname == "/trending" ? 'active':""}`} to="/trending">Trending</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${locations.pathname == "/feature-products" ? 'active':""}`} to="/feature-products">Featured Products</Link>
              </li>
          </ul>
          <ul className="bottom-nav-bar-sub_menu"> 
              <li className="nav-item">
                <Link className={`nav-link ${locations.pathname == "/cart" ? 'active':""}`} aria-current="page" to="/cart"><i className="bi bi-cart3 fs-5"></i> Cart({cart.carts.length})</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" onClick={wishlist.handleModal}><i className="bi bi-heart-fill fs-5"></i> Wishlist()</Link>
              </li>
              {
                !token ?
                (
                  <li><Link className="nav-link" to="/login"><span className='fs-4'><i className="bi bi-box-arrow-in-right"></i></span> Login</Link></li>
                )
                :
                (
                <li className="nav-item dropdown dropdown-start">
                  <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {
                      user.url? 
                      <img className='me-1' src={`${import.meta.env.VITE_API_BASE_URL}/uploads/admin/users/` + user.url} alt="avatar" width="25px" height="25px" style={{borderRadius:"50%"}}/>
                      :
                      <i className="bi bi-person-circle fs-5 me-1"></i> 
                    }
                    {user.user_name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" style={{maxWidth:"200px"}}>
                    <li>
                      {
                        user.user_name && 
                        user.role == "admin" ?
                        <Link className="dropdown-item" to="/admin"><span className='fs-4'><i className="bi bi-person-fill-gear"></i></span>  Admin</Link>
                        :
                        <a className="dropdown-item" href="/profile"><span className='fs-4'><i className="bi bi-person-lines-fill"></i></span> Your Profile</a>
                      }
                    </li>
                    <li><Link className="dropdown-item" to="/orders"><span className='fs-4'><i className="bi bi-box-arrow-in-right"></i></span> Your Order</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" onClick={(e) => userLogout(e)}><span className='fs-4'><i className="bi bi-box-arrow-in-right"></i></span> Logout</Link></li>
                    
                  </ul>
                </li>
                )
              }
              
          </ul>
        </div> 
      </div>
    </>
  )
}

export default HeadBar