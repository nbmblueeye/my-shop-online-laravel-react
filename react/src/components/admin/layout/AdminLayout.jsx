import React, { useState } from 'react'
import Header from './Header'
import SideBar from './SideBar'
import { useThemeModeContext } from '../../../contexts/ThemeModeContext'
import Content from './Content'

const AdminLayout = () => {

  const [showSideBar, setShowSideBar] = useState(true);

  const themeMode = useThemeModeContext();

  const _setShowSideBar = (e) => {
    e.preventDefault();
    setShowSideBar(() => !showSideBar);
  }

  return (
    <div className={`my_online_shop_body ${themeMode.mode}`}>
      <Header showSideBar={showSideBar} setShowSideBar={_setShowSideBar}/>
      <div className="my_online_shop_main">
        <div className="container">
          <div className={`my_online_shop_admin ${showSideBar ? "":"hide-side-bar"}`}>
            <div className={`admin-column side-bar ${showSideBar ? "hide-side-bar":""}`}>
              <SideBar/>
            </div>
            <div className="admin-column content">
              <Content/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout