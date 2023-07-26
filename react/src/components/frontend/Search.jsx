import React, { useState,useRef } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';

const Search = () => {

    let [search, setSearch] = useState('');
    let navigate = useNavigate();
   
    const _setSearch = async(e) => {
        setSearch(e.target.value);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        navigate({
            pathname: '/search',
            search: search ? `?${createSearchParams({s: search})}`:"",
        })

        setSearch("");
    }

  return (
    <>
        <form className="d-flex navbar_search_input" role="search" onSubmit={(e) => handleSearch(e)}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e) => _setSearch(e)}/>
            <button className="btn btn-outline-secondary text-white" type='submit'>Search</button>
        </form>
    </>
  )
}

export default Search