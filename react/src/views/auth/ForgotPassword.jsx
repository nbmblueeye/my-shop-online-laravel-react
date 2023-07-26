import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/frontend/layout/MainLayout';
import axiosClient from '../../axiosClient';


const ForgotPassword = () => {

    const [errors, setErrors] = useState({});
    const [feedback, setFeedBack] = useState({
      error:null,
      message:null,
    });

    const [sending, setSending] = useState(false);
    let emailRef = useRef(null);

    const resetPasswordRequest = async(e) => {
      e.preventDefault();
      setSending(true);

      let passwordForm = new FormData();
      passwordForm.append('email', emailRef.current.value);

      await axiosClient.post('/forgot-password',  passwordForm)
      .then(res => {
          if(res && res.status == 201){
            setSending(false);
            setErrors({});
            setFeedBack({...feedback, ...{error: "", message:res.data.message}});
            emailRef.current.value = "";
            setTimeout(() => {
              setFeedBack({...feedback, ...{error: "", message:""}});
            }, 3000);
          }
        })
        .catch(err => {
          if(err){
            setSending(false);
            let { response } = err;
            if(response && response.status == 422){
              setErrors(response.data.errors);
              setFeedBack({...feedback, ...{error: "", message:""}});
            }else if(response && response.status == 500){
              setErrors({});
              setFeedBack({...feedback, ...{error:response.data.error, message: ""}});
            }
            console.log(err);
          }
        });
    }

  return (
      <MainLayout>
        <div className="card mx-auto mb-5 shadow" style={{maxWidth: '500px'}}>
            <div className="card-header"><h5 className="card-title">Forgot Password</h5></div>
            <div className="card-body">
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
                  feedback.message ?
                  <div className="my_online_shop_message">
                    <div className="success text-success">
                        <p><strong>Success!</strong> {feedback.message}</p>
                    </div>
                  </div>
                  :
                  ""
                }
                <form onSubmit={(e) => resetPasswordRequest(e)} autoComplete='on'>
                    <div className="mb-5">
                        <label htmlFor="email" className="form-label">Your Registered Email:</label>
                        <input type="text" className="form-control" name="email" placeholder="name@example.com" ref={emailRef}/>
                        {errors.hasOwnProperty('email') && errors.email.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                    </div>  
                    <div className="d-flex justify-content-between mb-3">
                      <div className='d-flex'>
                        <p>Go to <Link to="/login" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Login</Link></p>
                      </div>
                      {
                      sending ?
                      <button className="btn btn-primary" type="button" disabled>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Sending...
                      </button>
                      :
                      <button className="btn btn-primary" type="submit">Request for reset password</button>
                      } 
                    </div>
                    
                </form>
            </div>
        </div>
      </MainLayout>
  )
}

export default ForgotPassword