import React, { useEffect, useState } from 'react';

const LPagination = ({items, onPaginate}) => {

   const [links, setLinks] = useState([]);
 
    useEffect(() => {
        setLinks(items.links);      
    }, [items])

    const _onPaginate = (e, link) => {

        e.preventDefault();
        if(!link){
            return false;
        }else{
            onPaginate(link);
        }

    }
  
  return (
   
    <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center my_online_shop_component">
            <li className={`page-item  ${items.current_page == items.from ? "disabled":""}`}>
                <a className="page-link" onClick={(e) => _onPaginate(e, items.prev_page_url)}>Previous</a>
            </li>
            {
                links.length > 0 && links.map((link, index) => 
                   index != 0 && index != links.length-1 ?    
                   <li key={index} className={`page-item ${link.active ? "active":""}`} aria-current = {`${link.active ? "page":""}`}>
                        <a className="page-link" onClick={(e) => _onPaginate(e, link.url)}>{link.label}</a>
                    </li>
                    :
                    ""
                )
            }
            <li className={`page-item  ${items.current_page == items.last_page ? "disabled":""}`}>
                <a className="page-link" onClick={(e) => _onPaginate(e, items.next_page_url)}>Next</a>
            </li>
        </ul>
    </nav>
    
  )
}

export default LPagination