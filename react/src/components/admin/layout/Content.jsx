import React from 'react'
import { Outlet } from 'react-router-dom'
import ProductContext from '../../../contexts/product/ProductContext'

const Content = () => {
  return (
    <div className='my_online_shop_admin_content'>
       <div className="wrapper">
          <ProductContext>
            <Outlet/>
          </ProductContext>
      </div>
    </div>
  )
}

export default Content