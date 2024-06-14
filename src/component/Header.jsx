import React from 'react'
import { Link } from 'react-router-dom'


function Header() {
  return (
    <div className='bg-slate-300 '>
        <div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
            <h1 className=''>MehanEstate</h1>
            <form className='bg-slate-200 p-2'>
                <input type="text"placeholder='search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                <i class="fa-solid fa-magnifying-glass"></i>
            </form>
            <ul className='flex gap-3'>
             <Link to='/'><li className='hover:underline'>Home</li></Link>
              <Link to='/about'><li className='hover:underline'>About</li></Link>
              <Link to='/signIn'><li>SignIN</li></Link>
            </ul>
        </div>
    </div>
  )
}

export default Header