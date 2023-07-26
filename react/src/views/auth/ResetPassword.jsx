import React, { useState, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../../axiosClient';


const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  const [reseting, setReseting] = useState(false);

  const [errors, setErrors] = useState({});
  const [feedback, setFeedBack] = useState({
    error:null,
    message:null,
  });

  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);

  const resetPassword = async(e) => {
    e.preventDefault();
    setReseting(true);

    let passwordForm = new FormData();
    passwordForm.append('email', searchParams.get('email'));
    passwordForm.append('token', token);
    passwordForm.append('password', passwordRef.current.value);
    passwordForm.append('password_confirmation', passwordConfirmationRef.current.value);

    await axiosClient.post('/reset-password',  passwordForm)
    .then(res => {
        if(res && res.status == 202){
          setReseting(false);
          setErrors({});
          setFeedBack({...feedback, ...{error: "", message:res.data.message}});
          passwordRef.current.value = "";
          passwordConfirmationRef.current.value = "";
        }
    })
    .catch(err => {
      if(err){
        setReseting(false);
        let { response } = err;
        if(response && response.status == 422){
          setErrors(response.data.errors);
          setFeedBack({...feedback, ...{error: "", message:""}});
        }else if(response && response.status == 500){
          setErrors({});
          setFeedBack({...feedback, ...{error:response.data.error, message: ""}});
        }
      }
      console.log(err);
    });
  }

  return (
    <div className="container my-online-shop-main-section-content">
      <div className="col-10 col-md-6 col-lg-4 mx-auto" style={{marginTop:'5rem'}}>
        <div className="card border-info">
          <div className="card-header"><h5 className="card-title">Reset Your Password</h5></div>
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
            <form onSubmit={(e) => resetPassword(e)}>
                {errors.hasOwnProperty('email') && errors.email.map((err,index) => (<small className="text-danger fst-italic fw-lighter mb-3" key={index}>{err}</small>))}
                {errors.hasOwnProperty('token') && errors.token.map((err,index) => (<small className="text-danger fst-italic fw-lighter mb-3" key={index}>{err}</small>))}
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" ref={passwordRef}/>
                {errors.hasOwnProperty('password') && errors.password.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password Confirmation</label>
                <input type="password" className="form-control" name="password_confirmation" ref={passwordConfirmationRef}/>
                {errors.hasOwnProperty('password_confirmation') && errors.password_confirmation.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
              </div>
              <div className="mb-3 w-100 d-flex justify-content-between mb-4">
                  {
                    reseting ?
                    <button className="btn btn-primary" type="button" disabled>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Reseting...
                    </button>
                    :
                    <button className="btn btn-primary px-3" type="submit">Reset Password</button>
                  } 
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword