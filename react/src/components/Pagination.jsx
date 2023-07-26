import React from 'react';

const Pagination = ({postperpage, totalpost, paginate, currentNumber}) => {

  let totalPage = Math.ceil(totalpost / postperpage);
  let pages = [];
    for(let i = 1; i <= totalPage; i++){
        pages.push(i);
    }

  return (
    <nav aria-label="Page navigation">
        <ul className="pagination my_online_shop_component">
            <li className={`page-item ${currentNumber == 1? "disabled": ""}`} tabIndex="-1" aria-disabled="true" onClick={() => paginate(currentNumber > 1 ? currentNumber - 1:1)}><a className="page-link">Previous</a></li>
            {
                pages.map((page, i) => 
                    (<li className={`page-item ${currentNumber == i + 1 ? "active": ""}`} aria-current={currentNumber == i + 1 ? "page":""} key={i} onClick={() => paginate(page)}><a className="page-link">{page}</a></li>)    
                )
            }
            
            <li className={`page-item ${currentNumber == totalPage? "disabled": ""}`} onClick={() => paginate(currentNumber < totalPage ? currentNumber + 1:totalPage )}><a className="page-link">Next</a></li>
        </ul>
    </nav>
  )

}

export default Pagination