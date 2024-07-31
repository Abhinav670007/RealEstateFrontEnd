import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate,useLocation } from 'react-router-dom'

function Header() {

  const [searchTerm, setSearchTerm] = useState('')
  const {currentUser}= useSelector(state=>state.user)
  const location = useLocation();
  const navigate = useNavigate()

  // console.log('header value is',searchTerm);
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('serachTerm',searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // console.log('Original urlParams:', Array.from(urlParams.entries()));

    const params = Object.fromEntries(urlParams.entries());
    // console.log('params:', params);

    const normalizedParams = Object.keys(params).reduce((acc, key) => {
      acc[key.toLowerCase()] = params[key];
      return acc;
    }, {});
    // console.log('normalizedParams:', normalizedParams);

    const searchTermFromUrl = normalizedParams['searchterm'];
    // console.log('searchTermFromUrl:', searchTermFromUrl);

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

  }, [location.search]);
  return (
    <div className='bg-slate-300 '>
        <div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
            <Link to={'/'}>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>prime</span>
            <span className='text-slate-700'>Properties</span>
          </h1>
            </Link>
            <form onSubmit={handleSubmit} className='bg-slate-200 p-2 rounded-lg'>
                <input onChange={(e)=> setSearchTerm(e.target.value)} type="text" placeholder='search...' className='bg-transparent focus:outline-none w-24 sm:w-64 ' value={searchTerm}/>
              <button>
                  <i class="fa-solid fa-magnifying-glass"></i>
              </button>
             </form>
            <ul className='flex gap-3'>
             <Link to='/'><li className='hover:underline'>Home</li></Link>
              <Link to='/about'><li className='hover:underline'>About</li></Link>
              <Link to='/profile'>
              {currentUser ?(
                <img className='rounded-full h-7 w-7 object-cover ' src={currentUser.avatar} alt="profile" />
              ):(
                <li className='text-slate-700 hover:underline'>SignIN</li>
              )}
             </Link>
            </ul>
        </div>
    </div>
  )
}

export default Header