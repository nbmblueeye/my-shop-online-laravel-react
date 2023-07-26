import React, { useState } from 'react';
import SideBarItem from './SideBarItem';

const SideBar = () => {
  
  const [activeItem, setActiveItem] = useState([
      {name: "DashBoard", status: false, icon:"bi bi-pie-chart", link:"/admin/dashboard", signal:"", items:[]},
      {name: "Orders", status: false , icon:"bi bi-cash-coin", link:"/admin/orders", signal:"", items:[]},
      {name: "Products", status: false, icon:"bi bi-shop", link:"/admin/products", signal:"bi bi-chevron-double-down", items:[{name:'Categories', link:"/admin/categories"}, {name:'Brands', link:"/admin/brands"}, {name:'Colors', link:"/admin/colors"}, {name:'Products', link:"/admin/products"}]},
      {name: "Users", status: false, icon:"bi bi-person-add", link:"/admin/users", signal:"bi bi-chevron-double-down", items:[{name:'Users List', link:"/admin/users"}, {name:'Roles', link:""}]},
      {name: "Sliders", status: false, icon:"bi bi-sliders", link:"/admin/sliders", signal:"", items:[]},
      {name: "Web Setting", status: false , icon:"bi bi-gear", link:"/admin/setting", signal:"", items:[]},
    ]);

  return (
    
    <div className='my_online_shop_admin_sidebar my_online_shop_section'>

       <div className="wrapper ">

        <SideBarItem activeItem={activeItem} setActiveItem={setActiveItem} icon="bi bi-pie-chart" name="DashBoard"/>

        <div className="row fw-light my_online_shop_admin_divider">
          <div className="col-auto">Page</div>
          <div className="col line"></div>
        </div>
       
        <SideBarItem activeItem={activeItem} setActiveItem={setActiveItem} name="Orders"/>

        <SideBarItem activeItem={activeItem} setActiveItem={setActiveItem}  name="Products"/>

        <SideBarItem activeItem={activeItem} setActiveItem={setActiveItem}  name="Users" />

        <div className="row fw-light my_online_shop_admin_divider">
          <div className="col-auto">Component</div>
          <div className="col line"></div>
        </div>

        <SideBarItem activeItem={activeItem} setActiveItem={setActiveItem} name="Sliders" />

        <div className="row fw-light my_online_shop_admin_divider">
          <div className="col-auto">Web Setting</div>
          <div className="col line"></div>
        </div>

        <SideBarItem activeItem={activeItem} setActiveItem={setActiveItem} name="Web Setting" />

      </div>

    </div>
   
  )
}

export default SideBar