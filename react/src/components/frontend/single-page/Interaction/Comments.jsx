import React, { useState, useEffect } from 'react';
import axiosClient from '../../../../axiosClient';
import Reply from './Reply';
import { useUserContext } from '../../../../contexts/Auth/UserContext';

const Comments = ({ product_id }) => {

    const [commentStart, setCommentStart] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const [activeUser, setActiveUser] = useState(null);
    const [reply, setReply] = useState({activeReply:null});

    const { user } = useUserContext();

    const _setReply = (e, comment_id) => {
        e.preventDefault();
        if(reply.activeReply != comment_id){
            setReply({...reply, activeReply:comment_id});
        }else{
            setReply({...reply, activeReply:null});
        } 
    }

    const [replyTab, setReplyTab] = useState({activeReplyTab:null});

    const _setReplyTab = (e, reply_id) => {
        e.preventDefault();
        if(replyTab.activeReplyTab != reply_id){
            setReplyTab({...replyTab, activeReplyTab:reply_id});
        }else{
            setReplyTab({...replyTab, activeReplyTab:null});
        } 
    }

    useEffect(() => {
        getComment(); 
        getActiveUser();

        return () => setRefresh(false);
    }, [product_id, refresh]);

    const getComment = async() => { 
        await axiosClient.get(`/comments/${product_id}`)
        .then(res => {
            if(res && res.status == 200){
                setComments(res.data.comments);
            }
        })
        .catch(err => {
            if(err){
                console.log(err);
            }
        })
    }

    const getActiveUser = async() => {
        if(user.token){
            await axiosClient.get(`/comments/user`)
            .then(res => {
                if(res && res.status == 200){
                    setActiveUser(res.data.user_id);
                }
            })
            .catch(err => {
                if(err){
                    console.log(err);
                }
            })
        }
    };
   
    const addComment = async(e) => {
        e.preventDefault();
       
        let commentForm = new FormData();
        commentForm.append('product_id', product_id);
        commentForm.append('comment', comment);    
        if(commentStart){
            setLoading(true); 
            await axiosClient.post('/comments', commentForm)
            .then(res => {
                if(res){
                    if(res.status == 201){    
                        setComment('');
                        setError('');
                        setCommentStart(false);
                        setRefresh(true);
                        setLoading(false);
                    }
                }
            })
            .catch(err => {
                if(err){
                    setLoading(false);
                    setCommentStart(false);
                    let { response } = err;
                    if(response && response.status == 422){
                        setError(response.data.errors.comment[0]);
                    }else if(response && response.status == 401){
                        setError(response.data.error);
                    }
                }
            })
        }else{
            setError('Please fill out your comment');
            return false;
        }   
    };

    const deleteComment = async(e, comment_id) => {
        e.preventDefault();
        setDeleting(comment_id);  
        await axiosClient.get(`/comment/${comment_id}`)
        .then(res => {
            if(res && res.status == 204){
                setRefresh(true);
                setDeleting(null);  
            }
        })
        .catch(err => {
            if(err){
                setDeleting(null);
                console.log(err);
            }
        })
    }

    return (   
        <>
            <div className="my_online_shop_add_comment mb-5">
                <form onSubmit={(e) => addComment(e)}>
                    <div className="row">
                        <div className="col">
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
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Add a Comment <span className='text-danger'>*</span></label>
                        <textarea className="form-control" rows={commentStart ? '5': '3'} onFocus={() => setCommentStart(true)}  value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                    </div>
                    
                        {
                            loading ?
                            <button className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                            :
                            <button className="btn btn-primary" type='submit'>Post Comment</button>
                        }

                </form>
            </div>
            {
                comments.length ?
                comments.map((com, index) =>
                    <div key={index} className="my_online_shop_display_comment d-flex flex-row px-5 mb-3"  >               
                        <div className="avatar me-3">
                            {
                                com.user.avatar? 
                                <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/admin/users/` + com.user.avatar} alt="avatar" width="25px" height="25px" style={{borderRadius:"50%"}}/>
                                :
                                <i className="bi bi-person-circle fs-1"></i> 
                            }
                        </div>
                        <div className="information w-100">
                            <p className='fw-bold text-primary mb-1'>{com.user.name} - <span className="fw-light text-muted">{com.created_at}</span></p>
                            <p>{com.comment}</p>
                            <div className="comment_action d-flex flex-row">
                                <p type="button" className="reply_btn" onClick={(e) => _setReply(e, com.id)}>Reply</p>
                                {
                                    activeUser == com.user_id ?
                                        deleting == com.id?
                                        <p type="button" disabled>
                                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                            <span className="visually-hidden">Loading...</span>
                                        </p>
                                        :
                                        <p type="button" className="delete_reply_btn" onClick={(e) => deleteComment(e, com.id)}>Delete</p> 
                                    :
                                    ""                          
                                }
                            </div>
                                {/* //Reply to comment */}
                                {
                                    reply.activeReply == com.id && 
                                    <div className="my_online_shop_add_comment">
                                        <Reply product_id={com.product_id} comment_id={com.id} setDisplayReply={setReply} setRefresh={setRefresh}/>
                                    </div>
                                }
                                {
                                    com.replies.length > 0 ? 
                                    
                                    <div className="my_online_shop_display_reply border">
                                               
                                        <div className="replyTab d-flex flex-column px-1" onClick={(e) => _setReplyTab(e, com.id)}>
                                            
                                            {
                                                replyTab.activeReplyTab != com.id?
                                                <>
                                                    <p className='text-body-secondary mb-0'><span>{com.replies.length}</span> replies </p>
                                                    <i className="bi bi-arrow-return-right"></i>
                                                </>
                                                :
                                                <i className="bi bi-arrow-90deg-left p-1 ms-auto"></i>
                                            }
                                        </div>
                                        
                                        {
                                            com.replies.map((rep,index) =>
                                                <div key={index} className={`${replyTab.activeReplyTab == com.id ? "open":"close"} d-flex flex-column px-3`}>
                                                    <div className="d-flex flex-row mb-3">
                                                        <div className="avatar me-3">
                                                            {
                                                                rep.user.avatar? 
                                                                <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/admin/users/` + rep.user.avatar} alt="avatar" width="25px" height="25px" style={{borderRadius:"50%"}}/>
                                                                :
                                                                <i className="bi bi-person-circle fs-1"></i> 
                                                            }
                                                        </div>
                                                        <div className="info w-100">
                                                            <p className='fw-bold text-primary mb-1'>{rep.user.name} - <span className="fw-light text-muted">{rep.created_at}</span></p>
                                                            <p>{rep.comment}</p>
                                                            <div className="comment_action d-flex flex-row">
                                                                <p type="button" className="reply_btn" onClick={(e) => _setReply(e, rep.id)}>Reply</p>
                                                                {
                                                                    activeUser == rep.user_id ?
                                                                    deleting == rep.id?
                                                                    <p type="button" disabled>
                                                                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </p>
                                                                    :
                                                                    <p type="button" className='delete_reply_btn' onClick={(e) => deleteComment(e, rep.id)}>Delete</p>
                                                                    :
                                                                    ""                            
                                                                }
                                                            </div>
                                                                {/* //Reply to comment */}
                                                                {
                                                                    reply.activeReply == rep.id && 
                                                                    <div className="my_online_shop_add_comment">
                                                                        <Reply product_id={rep.product_id} comment_id={rep.id} setDisplayReply={setReply} setRefresh={setRefresh}/>
                                                                    </div>
                                                                }

                                                                {
                                                                    rep.replies.length > 0 &&
                                                                    <div className="my_online_shop_display_sub_reply border">
                                                                        {
                                                                            rep.replies.map((sub_rep,index) => 
                                                                                <div key={index} className="d-flex flex-row px-3">
                                                                                    <div className="avatar me-3">
                                                                                        {
                                                                                            sub_rep.user.avatar? 
                                                                                            <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/admin/users/` + sub_rep.user.avatar} alt="avatar" width="25px" height="25px" style={{borderRadius:"50%"}}/>
                                                                                            :
                                                                                            <i className="bi bi-person-circle fs-1"></i> 
                                                                                        }
                                                                                    </div>
                                                                                    <div className="info w-100">
                                                                                        <p className='fw-bold text-primary mb-1'>{sub_rep.user.name} - <span className="fw-light text-muted">{sub_rep.created_at}</span></p>
                                                                                        <p>{sub_rep.comment}</p>
                                
                                                                                        <div className="comment_action d-flex flex-row">
                                                                                            {
                                                                                                activeUser == sub_rep.user_id ?
                                                                                                deleting == sub_rep.id?
                                                                                                <p type="button" disabled>
                                                                                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                                                                                    <span className="visually-hidden">Loading...</span>
                                                                                                </p>
                                                                                                :
                                                                                                <p type="button" className='delete_reply_btn' onClick={(e) => deleteComment(e, sub_rep.id)}>Delete</p> 
                                                                                                :
                                                                                                ""                           
                                                                                            }
                                                                                        </div>
                                                                                    </div>        
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                } 
                                                        </div>
                                                    </div>                 
                                                </div>
                                            )
                                        }
                                        
                                    </div>
                                    :
                                    ""
                                }
                                
                        </div>
                    </div>
                )
                :
                ""
            }
        </>
    )
}

export default Comments