import React from 'react';
import ScrollTop from '../ScrollTop';
import { Link } from 'react-router-dom';
import { useSettingContext } from '../../../contexts/SettingContext';

const Footer = () => {

    const { settings }  = useSettingContext();
  return (
    <div className='my-online-shop-footer'>
        <ScrollTop/>
        <div className="b-example-divider"></div>
        <div className="container">
            <footer className="pt-5 my-online-shop-section">
                <div className="row">
                    <div className="col-md-3">
                        <a href="/" className="d-flex align-items-center link-body-emphasis text-decoration-none">
                            <h4>{settings.websiteName}</h4>
                        </a>
                        <div className="footer_underline"></div>
                        <p className='text-body-secondary'>
                           {settings.websiteDescription}
                        </p>
                    </div>
                    <div className="col-md-8 ms-auto">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <h5>Quick Links</h5>
                                <div className="footer_underline"></div>
                                <ul className="nav flex-column">
                                    <li className="nav-item mb-2"><Link to="/home" className="nav-link p-0 text-body-secondary">Home</Link></li>
                                    <li className="nav-item mb-2"><Link to="/about-us" className="nav-link p-0 text-body-secondary">About Us</Link></li>
                                    <li className="nav-item mb-2"><Link to="/contact-us" className="nav-link p-0 text-body-secondary">Contact Us</Link></li>
                                    <li className="nav-item mb-2"><Link to="/blogs" className="nav-link p-0 text-body-secondary">Blogs</Link></li>
                                    <li className="nav-item mb-2"><Link to="/sitemaps" className="nav-link p-0 text-body-secondary">Sitemaps</Link></li>
                                </ul>
                            </div>

                            <div className="col-md-4 mb-3">
                                <h5>Shop Now</h5>
                                <div className="footer_underline"></div>
                                <ul className="nav flex-column">
                                    <li className="nav-item mb-2"><Link to="/categories" className="nav-link p-0 text-body-secondary">All Categories</Link></li>
                                    <li className="nav-item mb-2"><Link to="/new-arrivals" className="nav-link p-0 text-body-secondary">New Arrivals</Link></li>
                                    <li className="nav-item mb-2"><Link to="/trending" className="nav-link p-0 text-body-secondary">Trending</Link></li>
                                    <li className="nav-item mb-2"><Link to="/feature-products" className="nav-link p-0 text-body-secondary">Feature Products</Link></li>
                                </ul>
                            </div>

                            <div className="col-md-4 mb-3">
                                <h5>Reach Us</h5>
                                <div className="footer_underline"></div>
                                <ul className="nav flex-column">
                                    <li className="nav-item"> <p className='text-body-secondary p-0'><span className='fs-5 me-1'><i className="bi bi-geo-alt"></i></span> {settings.address}</p> </li>
                                    <li className="nav-item"> <p className='text-body-secondary p-0'><span className='fs-5 me-1'><i className="bi bi-telephone"></i></span> {settings.phoneNo1}</p> </li>
                                    <li className="nav-item"> <p className='text-body-secondary p-0'><span className='fs-5 me-1'><i className="bi bi-envelope"></i></span> {settings.emailNo1}</p> </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                    <p>&copy; 2023 nbmblueeye@gmail.com, Inc. All rights reserved.</p>
                    <ul className="list-unstyled d-flex">
                        <li className="ms-3"><Link className="link-body-emphasis" to={ `https://www.${settings.twitter}`} target='_blank'><span className='fs-3 text-primary'><i className="bi bi-twitter"></i></span></Link></li>
                        <li className="ms-3"><Link className="link-body-emphasis" to={ `https://www.${settings.instagram}` } target='_blank'><span className='fs-3 text-primary'><i className="bi bi-instagram"></i></span></Link></li>
                        <li className="ms-3"><Link className="link-body-emphasis" to={ `https://www.${settings.facebook}` } target='_blank'><span className='fs-3 text-primary'><i className="bi bi-facebook"></i></span></Link></li>
                        <li className="ms-3"><Link className="link-body-emphasis" to={ `https://www.${settings.youtube}` } target='_blank'><span className='fs-3 text-danger'><i className="bi bi-youtube"></i></span></Link></li>
                    </ul>
                </div>
            </footer>
        </div>
    </div>
  )
}

export default Footer
