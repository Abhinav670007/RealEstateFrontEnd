import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice'
import OAuth from '../component/OAuth'


function SignIn() {
  const [Signup, setSignUP] = useState({
    email:"",
    password:""
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log(Signup);
  const handlesubmit= async (e)=>{
    e.preventDefault()
    dispatch(signInStart())
    const sendData = await fetch(`${process.env.REACT_APP_ServerDomain}/User/login`,{
      method:"POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body:JSON.stringify(Signup),
       credentials: 'include'
    })
    const data = await sendData.json()
    if(data._id){
      dispatch(signInSuccess(data))
      alert("login successfull")
      navigate("/")
    }else{
      dispatch(signInFailure(data.message))
      alert(data.message)
    }
    
    }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignIn</h1>
      <form className='flex flex-col gap-4' onSubmit={handlesubmit}>
        <input type="email" placeholder='email'className='border p-3 rounded-lg' onChange={(e)=>setSignUP({...Signup,email:e.target.value})}/>
        <input type="password" placeholder='password'className='border p-3 rounded-lg' onChange={(e)=>setSignUP({...Signup,password:e.target.value})}/>
        <button className='bg-slate-600 text-white p-3 rounded uppercase hover:opacity-95 disabled:opacity-80'>Sign UP</button>
        <OAuth/>
      </form>
      <Link to={"/signUP"}><div className='mt-4'>Dont Have an account ? Sign up</div></Link>
      </div>
  )
}

export default SignIn