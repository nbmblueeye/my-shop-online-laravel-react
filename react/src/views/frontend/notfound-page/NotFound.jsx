import React from 'react'
import MainLayout from '../../../components/frontend/layout/MainLayout'

const NotFound = () => {
  return (
    <MainLayout>
      <div className="row justify-content-center align-items-center mt-5">
        <div className="col-md-6">
            <div className="card card-body border-danger">
                <h3>Page 403 | Forbidden</h3>
                <h5>Access Deny, You're not authorized</h5>
            </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default NotFound
