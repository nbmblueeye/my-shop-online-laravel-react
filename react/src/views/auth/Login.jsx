import React, { useRef, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axiosClient from '../../axiosClient';
import  { useUserContext }  from '../../contexts/Auth/UserContext';
import MainLayout from '../../components/frontend/layout/MainLayout';

const Login = () => {

  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const usercontext = useUserContext();

  const userLogin = async(e) => {
      e.preventDefault();
      setLoading(true);

      let loginForm = new FormData();
      loginForm.append('email', emailRef.current.value);
      loginForm.append('password', passwordRef.current.value);

      await axiosClient.post('/login', loginForm)
      .then(res => {
        if(res && res.status == 201){

          setLoading(false);
          usercontext._setToken(res.data.token);
          usercontext._setUser(res.data.user);
          setErrors({});
          navigate('/home');
          toast.fire({
            icon: 'success',
            text: "You have been logged in!",
          });

        }
      })
      .catch(err => {
        if(err){
          setLoading(false);
          let { response } = err;
          if(response && response.status == 422){
            setErrors(response.data.errors);
          }else if(response && response.status == 401){
            setErrors({});
            toast.fire({
              icon: 'error',
              text: response.data.error,
            });
          }else if(response && response.status == 403){
            setErrors({});
            toast.fire({
              icon: 'error',
              text: response.data.error,
            });
            navigate('/login');
          }

          console.log(err);
        }
      });
  }

  return (
    <MainLayout>
      <div className="card mb-5 mx-auto shadow" style={{maxWidth: '600px'}}>
        <div className="card-header"><h5 className="card-title">Login</h5></div>
        <div className="card-body">
          <form onSubmit={(e) => userLogin(e)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="text" className="form-control" name="email" placeholder="name@example.com" ref={emailRef}/>
              {errors.hasOwnProperty('email') && errors.email.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" name="password" ref={passwordRef}/>
              {errors.hasOwnProperty('password') && errors.password.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
            </div>
            <div className="w-100 d-flex justify-content-between mb-3">
              <div className='d-flex'>
                <p>Did not register yet? <Link to="/signup" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Register</Link></p>
              </div>
              {
                loading ?
                <button className="btn btn-primary" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Logging...
                </button>
                :
                <button className="btn btn-primary px-3" type="submit">Login</button>
              } 

            </div>
            <p><Link to="/forgot-password" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Forgot your password ?</Link></p>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}

export default Login
