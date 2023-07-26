import React from 'react'

const ThankYou = () => {
  return (
    <div className="container my-online-shop-main-section-content">
    <div className="col-6 mx-auto" style={{marginTop:'5rem'}}>
      <div className="card border-info shadow">
        <div className="card-body">
            <div className="my_online_shop_message">
              <div className="success text-success">
                  <p><strong>Success!</strong> Your order placed successfully!</p>
              </div>
            </div>
            <div className="logo"></div>
            <div className="mt-3 text-center">

                <h5 className='mb-3'>Thank you for shopping with us</h5>
                <button className="btn btn-primary">Shop more</button>
            </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ThankYou