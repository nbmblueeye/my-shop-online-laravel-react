import React, { useRef, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axiosClient from '../../axiosClient';
import  { useUserContext }  from '../../contexts/Auth/UserContext';
import MainLayout from '../../components/frontend/layout/MainLayout';

const Signup = () => {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const password_confirmationRef = useRef();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const usercontext = useUserContext();

  let navigate = useNavigate();

  const userSignup = async(e) => {
      e.preventDefault();

      setLoading(true);
      let form = new FormData();
      form.append('name', nameRef.current.value);
      form.append('email', emailRef.current.value);
      form.append('password', passwordRef.current.value);
      form.append('password_confirmation', password_confirmationRef.current.value);

      await axiosClient.post('/signup', form)
      .then(res => {
        if(res && res.status == 201){
          setLoading(false);
          setErrors({});
          nameRef.current.value = "";
          emailRef.current.value = "";
          passwordRef.current.value = "";
          password_confirmationRef.current.value = "";
          //usercontext._setToken(res.data.token);
          //usercontext._setUser(res.data.user);
          toast.fire({
            icon: 'warning',
            text: res.data.message,
          });
          
          navigate('/login');
        }
      })
      .catch(err => {
        if(err){
          setLoading(false);
          let { response } = err;
          if(response && response.status == 422){
            setErrors(response.data.errors);
          }else if(response && response.status == 500){
            setErrors({});
            toast.fire({
              icon: 'warning',
              text: err.response.data.error,
            });
          }
        }
      });

  }


  return (
    <MainLayout>
        <div className="card mb-5 mx-auto shadow" style={{maxWidth: '600px'}}>
          <div className="card-header"><h5 className="card-title">Register</h5></div>
          <div className="card-body">
            {/* {message && <div className="alert alert-success" role="alert">{message}</div>} */}

            <form onSubmit={(e) => userSignup(e)}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input type="text" className="form-control" name="name" placeholder="Your Name" ref={nameRef}/>
                {errors.hasOwnProperty('name') && errors.name.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="text" className="form-control" name="email" placeholder="name@example.com" ref={emailRef}/>
                {errors.hasOwnProperty('email') && errors.email.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" ref={passwordRef}/>
              </div>
              <div className="mb-3">
                <label htmlFor="c_password" className="form-label">Confirmed Password</label>
                <input type="password" className="form-control" name="password_confirmation" ref={password_confirmationRef}/>
                {errors.hasOwnProperty('password') && errors.password.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
              </div>
              <div className="d-flex justify-content-between mb-3 mt-5">
                  <div className='d-flex'>
                    <p>Already register ? <Link to="/login" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Login</Link></p>
                  </div>
                {
                  loading ?
                  <button className="btn btn-primary" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Signing...
                  </button>
                  :
                  <button className="btn btn-primary px-3" type="submit">Signup</button>
                } 
              </div>
            </form>
          </div>
        </div>
    </MainLayout>
  )
}

export default Signup