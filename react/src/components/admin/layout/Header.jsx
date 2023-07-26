import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeModeContext } from '../../../contexts/ThemeModeContext';
import { useUserContext } from '../../../contexts/Auth/UserContext';

const Header = ( { showSideBar, setShowSideBar } ) => {

  const [displaySearch, setdisplaySearch] = useState(false);
  const themeMode = useThemeModeContext();
  const userContext = useUserContext();
  

  return ( 
    <nav className="navbar my_online_shop_admin_navbar" id='my_online_shop_header'>
      <div className="container">
        <div className="navbar_box">
          <div className="navbar-column left">
            <a className="navbar-brand">Navbar</a>
            <div className="sidebar-toggler" onClick={(e) => setShowSideBar(e)}>
              {
                showSideBar ?
                <span><i className="bi bi-layout-text-sidebar"></i></span>
                :
                <span><i className="bi bi-layout-text-sidebar-reverse"></i></span>
              }
                
            </div> 
          </div>
          <div className="navbar-column right">
              <div className={`search ${displaySearch ? "display-search":""}`}>
                <form className="d-flex" role="search">
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                  <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
              </div>
              <div className="my-portfolio-box">  
                  <div className="row">
                    <div className='col fs-5 search-icon my_online_shop_component' onClick={() => setdisplaySearch(!displaySearch)}><i className="bi bi-search"></i></div>
                    <div className="col">
                      <li className="nav-item dropdown my_online_shop_section d-flex align-items-center">
                          <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {
                              userContext.user.url? 
                              <img className='me-1' src={`${import.meta.env.VITE_API_BASE_URL}/uploads/admin/users/` + userContext.user.url} alt="avatar" width="25px" height="25px" style={{borderRadius:"50%"}}/>
                              :
                              <i className="bi bi-person-circle fs-5 me-1"></i> 
                            }
                            {userContext.user.user_name}
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" to="/"><i className="bi bi-person-fill-gear fs-5"></i> To Front</Link></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li>
                              <Link className="dropdown-item" onClick={(e) => userContext.userLogout(e)}><i className="bi bi-box-arrow-left fs-5"></i> Logout</Link>
                            </li>
                          </ul>
                      </li> 
                    </div>
                    <div className="col">
                        <li className="nav-item dropdown ms-lg-5 my_online_shop_section d-flex align-items-center">
                          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className={`${themeMode.icon} fs-5`}></i>
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end text-center" style={{width:"80px"}}>
                              <li><a className="dropdown-item" href="#" onClick={(e) =>  themeMode._setThemeMode(e, 'light')}><i className="bi bi-brightness-high fs-5"></i> Light</a></li>
                              <li><a className="dropdown-item" href="#" onClick={(e) =>  themeMode._setThemeMode(e, 'dark')}><i className="bi bi-moon-stars fs-5"></i> Dark</a></li>
                              <li><hr className="dropdown-divider"/></li>
                              <li><a className="dropdown-item" href="#" onClick={(e) =>  themeMode._setThemeMode(e, 'auto')}><i className="bi bi-circle-half fs-5"></i> Auto</a></li>
                          </ul>
                        </li>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      
    </nav>

    
  )
}

export default Header