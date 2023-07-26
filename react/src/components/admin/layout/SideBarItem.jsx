import { useLocation, useNavigate } from 'react-router-dom';

const SideBarItem = ({name, activeItem, setActiveItem }) => {

    const navigated = useNavigate();
    const location = useLocation();
  
    const _setDisplayItem = (e, input) => {   
        e.preventDefault();
        if(!input.items.length > 0){
            navigated(input.link);
        }
        setActiveItem(activeItem.map((item, index) => item.name == input.name ? {...item, status:!item.status}:{...item, status:false}));
    }

    const toSpecifyPage = (url) => {
        navigated(url);
    } 

  return (
    <>
        {
            activeItem.map((item, index) =>
                item.name == name &&
                <div className="sidebar-box" key={index}>
                    <div className={`sidebar-item ${item.status ? "active":""}`} onClick={(e) =>_setDisplayItem(e, item)}>
                        <div className="tag"><span className='fs-5 me-3'><i className={ item.icon }></i></span> { name } </div>
                        <span className={`item-signal fs-6 ${item.status ? "show":""}`}> <i className={ item.signal }></i> </span>
                    </div>
                    <div className={`sub-sidebar-item ${item.status ? "active":""}`}>
                        {
                            item.items.length > 0 && item.items.map((sub_item, index) => (<div className={`item ${item.status? (location.pathname == sub_item.link ? "active":""):""}`} key={index} onClick={() => toSpecifyPage(sub_item.link)}>{sub_item.name}</div>))
                        }
                    </div>
                </div>
            )
        }
    </>
   
  )
}

export default SideBarItem