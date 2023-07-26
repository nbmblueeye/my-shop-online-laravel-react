import React, { useState, useEffect } from 'react';
import axiosClient from '../../../../axiosClient';


const Reply = ( {product_id, comment_id, setDisplayReply, setRefresh} ) => {

    const [replyStart, setReplyStart] = useState(false);

    const [reply, setReply] = useState('');
  
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const [error, setError] = useState(null);

    const replyComment = async(e) => {
        e.preventDefault();
        setLoading(true); 
       
        let commentForm = new FormData();
        commentForm.append('product_id', product_id);
        commentForm.append('comment', reply);
        commentForm.append('parent_id', comment_id);
        
        await axiosClient.post('/comments', commentForm)
        .then(res => {
            if(res){
                if(res.status == 201){
                   
                    setReply('');
                    setError('');
                    setReplyStart(false);
                    setDisplayReply(false);
                    setRefresh(true);
                    setLoading(false);
                }
            }
        })
        .catch(err => {
            if(err){
                setLoading(false);
                setReplyStart(false);
                let { response } = err;
                if(response && response.status == 422){
                    setError(response.data.errors.comment[0]);
                }else if(response && response.status == 401){
                    setError(response.data.error);
                }
            }
        })
         
    };

  
  return (
    <>
        <div className="my_online_shop_add_comment mb-3">
            <form onSubmit={(e) => replyComment(e)}>
                
                    {
                        error ?
                        <div className="my_online_shop_message">
                            <div className='danger text-danger'>
                                <p><strong>Danger!</strong> {error}</p>
                            </div>
                        </div>
                        :
                        ""
                    }
                 
                <div className="mb-3">
                    <textarea className="form-control" rows={replyStart ? '4': '3'} onFocus={() => setReplyStart(true)}  value={reply} onChange={(e) => setReply(e.target.value)}></textarea>
                </div>
                
                    {
                        loading ?
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        :
                        <button className="btn btn-primary" type='submit'>Post Reply</button>
                    }

            </form>
        </div>
       
    </>
  )
}

export default Reply