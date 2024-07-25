import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate,useLocation } from 'react-router-dom'

function Header() {

  const [searchTerm, setSearchTerm] = useState('')
  const {currentUser}= useSelector(state=>state.user)
  const location = useLocation();
  const navigate = useNavigate()

  console.log(searchTerm);
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('serachTerm',searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <div className='bg-slate-300 '>
        <div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
            <h1 className=''>MeDhuEstate</h1>
            <form onSubmit={handleSubmit} className='bg-slate-200 p-2'>
                <input onChange={(e)=> setSearchTerm(e.target.value)} type="text" placeholder='search...' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm}/>
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