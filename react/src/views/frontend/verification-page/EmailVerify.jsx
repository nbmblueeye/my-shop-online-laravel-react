import React, { useState, useRef, useEffect } from 'react'
import axiosClient from '../../../axiosClient';
import { useParams, useSearchParams } from 'react-router-dom';

const EmailVerify = () => {

   const [searchParams, setSearchParams] = useSearchParams();
   const { user_id} = useParams();

  const [feedback, setFeedBack] = useState({
      error:null,
      warning:null,
      message:null,
    });
    const [sending, setSending] = useState(false);

    let activeViewRef = useRef(null);
    useEffect(() => {
        window.scrollTo({
          top: activeViewRef.current.offsetTop,
          behavior: 'smooth',
        });
    }, []);

    useEffect(() => {

        const getVerify = async() => {
            setSending(true);
            await axiosClient.get(`/email/verify/${user_id}`, {params:{expires: searchParams.get('expires'), signature: searchParams.get('signature'),}})
            .then(res => {
                if(res && res.status == 200){
                  setSending(false);
                  setFeedBack({...feedback, ...{error: "", warning:"" , message:res.data.message}});
                }
              })
              .catch(err => {
                if(err){
                  setSending(false);
                  let { response } = err;
                  if(response && response.status == 403){
                    setFeedBack({...feedback, ...{error:response.data.error , warning:"" , message:""}});
                  }else if(response && response.status == 500){
                    setFeedBack({...feedback, ...{error:"" , warning:response.data.warning , message:""}});
                  }
                  console.log(err);
                }
              });
        }

        getVerify();
        
    }, [])

  return (
    <div className="container my-online-shop-main-section-content" ref={activeViewRef}> 
      <div className="row justify-content-center align-items-center mt-5">
        <div className="col-md-6">
            <div className="card card-body border-danger">
                {
                    sending &&  
                    <div className="d-flex justify-content-center w-100 py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                {
                    feedback.error ?
                    <div className="my_online_shop_message">
                    <div className='danger text-danger'>
                        <p><strong>Danger!</strong> {feedback.error}</p>
                    </div>
                    </div>
                    :
                    ""
                }
                {
                    feedback.warning ?
                    <div className="my_online_shop_message">
                        <div className='warning text-warning'>
                            <p><strong>Warning!</strong> {feedback.warning}</p>
                        </div>
                    </div>
                    :
                    ""
                }
                {
                    feedback.message ?
                    <div className="my_online_shop_message">
                        <div className="success text-success">
                            <p><strong>Success!</strong> {feedback.message}</p>
                        </div>
                    </div>
                    :
                    ""
                }
            </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerify