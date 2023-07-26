import React, { useState } from 'react';
import MainLayout from '../../../components/frontend/layout/MainLayout';
import axiosClient from '../../../axiosClient';

const ChangePasswordPage = () => {

    const [password, setPassword] = useState({
        currentPassword:"",
        password:"",
        password_confirmation:"",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const _setPassword = (e) => {
        setPassword({...password, [e.target.name] : e.target.value});
    }
  
    const changePassword = async(e) => {
        e.preventDefault();
        setLoading(true);

        let passwordForm = new FormData();
        passwordForm.append('currentPassword', password.currentPassword);
        passwordForm.append('password', password.password);
        passwordForm.append('password_confirmation', password.password_confirmation);

        await axiosClient.post('/profile/change-password', passwordForm)
        .then(res => {
            if(res){
              if(res.status == 202){
                setLoading(false);
                setErrors({});
                toast.fire({
                    icon: 'success',
                    text: res.data.message,
                });

                setPassword({...password, ...{currentPassword:"" , password:"", password_confirmation:"",}})
              }
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
                        icon: 'warning',
                        text: response.data.error,
                    });
                }else if(response && response.status == 406){
                    setErrors({});
                    toast.fire({
                        icon: 'warning',
                        text: response.data.error,
                    });
                }
                console.log(err);
            }
          });

    };


  return (
    <MainLayout>
        <div className="p-5 my-online-shop-section">
            <div className="card shadow card-box mx-auto" style={{maxWidth:"500px"}}>
                <div className="card-header py-3 d-flex justify-content-between">
                    <h5>Change Password</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={(e) => changePassword(e)}>
                        <div className="row mb-5">
                            <div className="col-12">
                                <label className="col-form-label">Current Password:</label>
                                <input type="password" className="form-control" name="currentPassword" value={password.currentPassword} onChange={(e) => _setPassword(e)}/>
                                {errors.hasOwnProperty('currentPassword') && 
                                errors.currentPassword.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col-12">
                                <label className="col-form-label">New Password:</label>
                                <input type="password" className="form-control" name="password" value={password.password} onChange={(e) => _setPassword(e)}/>
                            </div>
                            <div className="col-12">
                                <label className="col-form-label">New Password Confirmation:</label>
                                <input type="password" className="form-control" name="password_confirmation" value={password.password_confirmation} onChange={(e) => _setPassword(e)}/>
                                {errors.hasOwnProperty('password') && 
                                errors.password.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                        </div>
                        <hr/>
                        <div className="float-end">
                            {
                                loading ?
                                <button className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Updating...
                                </button>
                                :
                                <button className="btn btn-primary" type="submit">Update Password</button>
                            } 
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </MainLayout>
  )
}

export default ChangePasswordPage