import React, { useRef, useState } from 'react';
import axiosClient from '../../../axiosClient';
import { useSettingContext } from '../../../contexts/SettingContext';


const Setting = () => {

    const [errors, setErrors] = useState({});
    const { settings, setSettings, setRefresh, loading } = useSettingContext();
    const  [saving, setSaving] = useState(false);

    const _setSetting = (e) => {
        setSettings({...settings,[e.target.name]: e.target.value}); 
    }

    const addSetting = async(e) => {
        e.preventDefault();
        setSaving(true);
        
        await axiosClient.post('/admin/settings/add', settings)
        .then(res => {
            setErrors({});
            setSaving(false);

            if(res && res.status == 201){
                toast.fire({
                    icon: 'success',
                    text: res.data.message,
                });
                
               setTimeout(() => {
                    setRefresh(true);
               }, 2200);
            }
            
        })
        .catch(err => {
            let { response } = err;
            if(response && response.status == 422){
              setErrors(response.data.errors);
              setSaving(false);      
            }
            console.log(err);
        });
    }

  return (
    <div>
        {
            loading ?
            <div className="w-100 d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            :
            <form onSubmit={(e) => addSetting(e)}>
                <div className="card mb-5">
                    <div className="card-header bg-primary">
                        <h5 className='text-white'>Website</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Website Name</label>
                                <input type="text" className="form-control" name="websiteName" value={settings.websiteName} onChange={(e) => _setSetting(e)}/>
                                {errors.hasOwnProperty('websiteName') && errors.websiteName.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Website Url</label>
                                <input type="text" className="form-control" name="websiteUrl" value={settings.websiteUrl} onChange={(e) => _setSetting(e)}/>
                                {errors.hasOwnProperty('websiteUrl') && errors.websiteUrl.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col-12">
                                <label className="form-label">Website Description</label>
                                <textarea className="form-control" rows="3" name="websiteDescription" value={settings.websiteDescription} onChange={(e) => _setSetting(e)}></textarea>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Page Title</label>
                                <input type="text" className="form-control" name="pageTitle" value={settings.pageTitle} onChange={(e) => _setSetting(e)}/>
                                {errors.hasOwnProperty('pageTitle') && errors.pageTitle.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Meta Keywords</label>
                                <input type="text" className="form-control" name="metaKeywords" value={settings.metaKeywords} onChange={(e) => _setSetting(e)}/>
                                {errors.hasOwnProperty('metaKeywords') && errors.metaKeywords.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Meta Description</label>
                                <input type="text" className="form-control"  name="metaDes" value={settings.metaDes} onChange={(e) => _setSetting(e)}/>
                                {errors.hasOwnProperty('metaDes') && errors.metaDes.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-5">
                    <div className="card-header bg-primary">
                        <h5 className='text-white'>Website Information</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label">Address</label>
                                <textarea className="form-control" rows="3" name="address" value={settings.address} onChange={(e) => _setSetting(e)}></textarea>
                                {errors.hasOwnProperty('address') && errors.address.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Phone No.1</label>
                                <input type="text" className="form-control" name="phoneNo1" value={settings.phoneNo1} onChange={(e) => _setSetting(e)}/>
                                {errors.hasOwnProperty('phoneNo1') && errors.phoneNo1.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Phone No.2</label>
                                <input type="text" className="form-control" name="phoneNo2" value={settings.phoneNo2} onChange={(e) => _setSetting(e)}/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email No.1</label>
                                <input type="text" className="form-control" name="emailNo1" value={settings.emailNo1} onChange={(e) => _setSetting(e)}/>
                                {errors.hasOwnProperty('emailNo1') && errors.emailNo1.map((err,index) => (<small className="text-danger fst-italic fw-lighter" key={index}>{err}</small>))}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email No.2</label>
                                <input type="text" className="form-control" name="emailNo2" value={settings.emailNo2} onChange={(e) =>_setSetting(e)}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header bg-primary">
                        <h5 className='text-white'>Website Social Media</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">FaceBook</label>
                                <input type="text" className="form-control" name="facebook" value={settings.facebook} onChange={(e) => _setSetting(e)}/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Twitter</label>
                                <input type="text" className="form-control" name="twitter" value={settings.twitter} onChange={(e) => _setSetting(e)}/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Instagram</label>
                                <input type="text" className="form-control" name="instagram" value={settings.instagram} onChange={(e) => _setSetting(e)}/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Youtube</label>
                                <input type="text" className="form-control" name="youtube" value={settings.youtube} onChange={(e) => _setSetting(e)}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        {
                            saving ?
                            <button className="btn btn-primary float-end" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Saving...
                            </button>
                            :
                            <button type="submit" className="btn btn-primary float-end">Save Setting</button>
                        }
                        
                    </div>
                </div>
            </form>
        }
    </div>
  )
}

export default Setting
