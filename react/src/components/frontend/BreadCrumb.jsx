import React from 'react';
import { Link } from 'react-router-dom';

const BreadCrumb = ( { locations } ) => {
 
  let Params = locations.pathname.trim().split("/").filter(param => param != "");
  let params = [];

  if(typeof(parseInt(Params[Params.length - 1]) == "number") && Params.length - 1 > 1){
    params = Params.slice(0, Params.length - 1);
  }else{
    params =  Params;
  }
 
  let output = "";
  output = params.map((param, index) => params.length - 1 == index ?
              <li key={index} className="breadcrumb-item active" aria-current="page">{params[index].charAt(0).toUpperCase() + params[index].slice(1)}</li>
              :
              params.length >= 3 && index >= 1 ?
              <Link key={index} className="breadcrumb-item --bs-info-bg-subtle" to={`/${params[index-1]}/${params[index]}`}>{param.charAt(0).toUpperCase() + param.slice(1)}</Link>
              :
              <Link key={index} className="breadcrumb-item --bs-info-bg-subtle" to={`/${param}`}>{param.charAt(0).toUpperCase() + param.slice(1)}</Link>);
              
  return (
    <div className='my-online-shop-section breadcrumb'>
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <Link className="breadcrumb-item --bs-info-bg-subtle" to="/home">Home</Link>
                {
                 output
                }
            </ol>
        </nav>
    </div>
  )
}

export default BreadCrumb
