import React from 'react';
import Comments from './Comments';
import Infomation from './Infomation';

const Interaction = ({product_id, product_description}) => {
 
  return (
    <> 
        <div className="card-section-title">
            <h5 className="section-title text-success mb-4">Additional Information</h5>
            <p></p>
        </div>
        <div className="p-3">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="review-tab" data-bs-toggle="tab" data-bs-target="#review-tab-pane" type="button" role="tab" aria-controls="review-tab-pane" aria-selected="true"><h6>Reviews</h6></button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="information-tab" data-bs-toggle="tab" data-bs-target="#information-tab-pane" type="button" role="tab" aria-controls="information-tab-pane" aria-selected="false"><h6>Product Information</h6></button>
                </li>
            </ul>
            <div className="tab-content pt-3" id="myTabContent">
                <div className="tab-pane fade show active" id="review-tab-pane" role="tabpanel" aria-labelledby="review-tab" tabIndex="0">     
                    <Comments product_id={product_id}/>
                </div>
                <div className="tab-pane fade" id="information-tab-pane" role="tabpanel" aria-labelledby="information-tab" tabIndex="0">
                    <Infomation description={product_description}/>
                </div>
            </div>
        </div>
    </>
  )
}

export default Interaction