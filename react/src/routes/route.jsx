import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "../views/auth/Login";
import Signup from "../views/auth/Signup";
import FrontEndLayout from "../components/frontend/layout/FrontEndLayout";
import FrontPage from "../views/frontend/front-page/FrontPage";
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminProtectRoute from "./AdminProtectRoute";
import DashBoard from "../views/admin/dashboard/DashBoard";
import UserIndex from "../views/admin/users/UserIndex";
import ProductIndex from "../views/admin/production/products/ProductIndex";
import CateIndex from "../views/admin/production/categories/CateIndex";
import BrandIndex from "../views/admin/production/brands/BrandIndex";
import AddCate from "../views/admin/production/categories/AddCate";
import EditCate from "../views/admin/production/categories/EditCate";
import AddBrand from "../views/admin/production/brands/AddBrand";
import EditBrand from "../views/admin/production/brands/EditBrand";
import ColorIndex from "../views/admin/production/colors/ColorIndex";
import AddColor from "../views/admin/production/colors/AddColor";
import EditColor from "../views/admin/production/colors/EditColor";
import AddProduct from "../views/admin/production/products/AddProduct";
import EditProduct from "../views/admin/production/products/EditProduct";
import SliderIndex from "../views/admin/headslider/SliderIndex";
import AddSlider from "../views/admin/headslider/AddSlider";
import EditSlider from "../views/admin/headslider/EditSlider";
import ArchivePage from "../views/frontend/archive-page/ArchivePage";
import CategoryPage from "../views/frontend/category-page/CategoryPage";
import BrandPage from "../views/frontend/brand-page/BrandPage";
import SinglePage from "../views/frontend/single-page/SinglePage";
import CheckOut from "../views/frontend/checkout-page/CheckOut";
import CartPage from "../views/frontend/cart-page/CartPage";
import OrderPage from "../views/frontend/order-page/OrderPage";
import OrderDetail from "../views/frontend/order-page/OrderDetail";
import Orders from "../views/admin/orders/Orders";
import Order from "../views/admin/orders/Order";
import NewArrivalPage from "../views/frontend/new-arrival-page/NewArrivalPage";
import TrendingPage from "../views/frontend/trending-page/TrendingPage";
import FeaturePage from "../views/frontend/feature-page/FeaturePage";
import Setting from "../views/admin/setting/Setting";
import AddUser from "../views/admin/users/AddUser";
import EditUser from "../views/admin/users/EditUser";
import ProfilePage from "../views/frontend/profile-page/ProfilePage";
import SearchPage from "../views/frontend/search-page/SearchPage";
import ChangePasswordPage from "../views/frontend/profile-page/ChangePasswordPage";
import ForgotPassword from "../views/auth/ForgotPassword";
import ResetPassword from "../views/auth/ResetPassword";
import EmailVerify from "../views/frontend/verification-page/EmailVerify";
import AdminNotFound from "../views/admin/notfound/AdminNotFound";
import NotFound from "../views/frontend/notfound-page/NotFound";
import ThankYou from "../views/frontend/checkout-page/ThankYou";
import WishlistPage from "../views/frontend/wishlist-page/WishlistPage";
import AboutUs from "../views/frontend/global-page/AboutUs";
import ContactUs from "../views/frontend/global-page/ContactUs";
import Blogs from "../views/frontend/global-page/Blogs";
import SiteMaps from "../views/frontend/global-page/SiteMaps";

const router = createBrowserRouter([

    {
        path:'/',
        element:<FrontEndLayout/>,
        children:[
            {
                path:'/',
                element: <Navigate to="/home"/>,
            },

            {
                path:'/home',
                element: <FrontPage/>,
            },

            {
                path:'/login',
                element: <Login/>,
            },

            {
                path:'/signup',
                element:<Signup/>
            },

            {
                path:'/api/email/verify/:user_id',
                element: <EmailVerify/>,
            },

            {
                path:'/forgot-password',
                element: <ForgotPassword/>,
            },

            {
                path:'/reset-password/:token',
                element: <ResetPassword/>
            },

            {
                path:'/categories',
                element:<ArchivePage/>
            },

            {
                path:'/:category',
                element: <CategoryPage/>,
            },

            {
                path:'/:category/:brand',
                element: <BrandPage/>,
            },

            {
                path:'/:category/:brand/:product/:id',
                element: <SinglePage/>,
                
            },

            
            {
                path:'/cart',
                element:<CartPage/>
            },

            {
                path:'/wishlist',
                element:<WishlistPage/>
            },

            {
                path:'/cart/checkout',
                element:<CheckOut/>,
            },

            {
                path:'/cart/checkout/thankyou',
                element:<ThankYou/>,
            },

            {
                path:'/orders',
                element:<OrderPage/>,
            },

            {
                path:'orders/order/:order_id',
                element:<OrderDetail/>,
            },

            {
                path: '/new-arrivals',
                element: <NewArrivalPage/>
            },

            {
                path:'/trending',
                element:<TrendingPage/>,
            },

            {
                path:'/feature-products',
                element: <FeaturePage/>
            },

            {
                path:'/profile',
                element: <ProfilePage/>,
            },

            {
                path:'/profile/change-password',
                element:<ChangePasswordPage/>,
            },

            {
                path:'/search',
                element: <SearchPage/>,
            },

            {
                path:'/about-us',
                element: <AboutUs/>,
            },

            {
                path:'/contact-us',
                element: <ContactUs/>,
            },

            {
                path:'/blogs',
                element: <Blogs/>,
            },

            {
                path:'/sitemaps',
                element: <SiteMaps/>,
            },

        ],
    },

    {
        element: <AdminProtectRoute/>,
        children:[
            {
                path:'/admin',
                element: <AdminLayout/>,
                children:[
                    {
                        path:'/admin',
                        element: <Navigate to="/admin/dashboard"/>,
                    },
                    
                    {
                        path:'/admin/dashboard',
                        element: <DashBoard/>,
                    },
        
                    {
                        path:'/admin/users',
                        element: <UserIndex/>,
                    },

                    {
                        path:'/admin/add-user',
                        element: <AddUser/>,
                    },

                    {
                        path:'/admin/edit-user/:user_id',
                        element:<EditUser/>,
                    },

                    {
                        path:'/admin/orders',
                        element: <Orders/>,
                    },

                    {
                        path:'/admin/order/:order_id',
                        element: <Order/>,
                    },

                //*** * Admin/Product Route
                    {
                        path:'/admin/products',
                        element: <ProductIndex/>,
                    },
                    {
                        path:'/admin/add-product',
                        element: <AddProduct/>,
                    },
                    {
                        path:'/admin/edit-product/:id',
                        element: <EditProduct/>,
                    },

                //*** * Admin/Category Route
                    {
                        path:'/admin/categories',
                        element:<CateIndex/>
                    },
                    {
                        path:'/admin/add-category',
                        element:<AddCate/>
                    },
                    {
                        path:'/admin/edit-category/:id',
                        element: <EditCate/>
                    },
                //*** * End Admin/Category Route

                //*** * Admin/Brand Route
                    {
                        path:'/admin/brands',
                        element:<BrandIndex/>
                    },
                    {
                        path:'/admin/add-brand',
                        element:<AddBrand/>,
                    },
                    {
                        path:'/admin/edit-brand/:id',
                        element:<EditBrand/>,
                    },
                //*** * End Admin/Brand Route 

                //*** * Admin/Color Route  
                    {
                        path:'/admin/colors',
                        element:<ColorIndex/>
                    },
                    {
                        path:'/admin/add-color',
                        element:<AddColor/>
                    },
                    {
                        path:'/admin/edit-color/:id',
                        element:<EditColor/>
                    },

                //*** * Admin/Head Slider Route
                    {
                        path:'/admin/sliders',
                        element: <SliderIndex/>
                    },
                    {
                        path:'/admin/add-slider',
                        element: <AddSlider/>,
                    },
                    {
                        path:'/admin/edit-slider/:id',
                        element: <EditSlider/>,
                    },
                    
                //*** * Admin/Setting Route
                    {
                        path:'/admin/setting',
                        element: <Setting/>
                    },

                 //*** * Admin/Page Not Found Route  
                    {
                        path:'/admin/*',
                        element:<AdminNotFound/>,
                    }

                ]
            },

            
        ]
       
    },

    {
        path:'*',
        element:<NotFound/>,
    },

]);

export default router;