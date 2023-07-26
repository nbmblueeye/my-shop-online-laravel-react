import React, { useState } from 'react';
import axiosClient from '../../axiosClient';

const SendInvoice = ( {order_id} ) => {

    const [invoice, setInvoice] = useState(false);

    const sendInvoice = async(e) => {
        e.preventDefault();
        setInvoice(true)
        await axiosClient.get(`/admin/send-invoice/${order_id}`)
        .then(res => {
            if(res && res.status == 200){
                setInvoice(false);
                toast.fire({
                    icon: 'success',
                    text: res.data.message,
                });
            }
        })
        .catch(err => {
            if(err){
                setInvoice(false);
                if(err.response && err.response.status == 404){
                    toast.fire({
                        icon: 'error',
                        text: err.response.data.error,
                    });
                }
                console.log(err);
            }
        })
    }

  return (
    <>
        <button type='button' className="btn btn-secondary me-3" disabled={invoice} onClick={(e) => sendInvoice(e)}>
            {
                invoice ?
                <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                </>
                :
                <> <i className="bi bi-envelope"></i> Send Invoice</>
            }
            
        </button>
    </>
  )
}

export default SendInvoice