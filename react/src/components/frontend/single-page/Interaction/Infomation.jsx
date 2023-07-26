import React, { useState, useEffect } from 'react';

const Infomation = ( {description} ) => {

  return (
    <div className='my-online-shop-main-section-content p-3'>
        <div className='ck-content'>
            <div dangerouslySetInnerHTML={{__html: description}}>
            </div>
        </div>
        
    </div>
  )
}

export default Infomation