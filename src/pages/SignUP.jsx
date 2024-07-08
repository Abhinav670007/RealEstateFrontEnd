import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../component/OAuth';

function SignUP() {
  const [Signup, setSignUP] = useState({
    username:"",
    email:"",
    password:""
  })
  const navigate = useNavigate()
  console.log(Signup);
  const handlesubmit= async (e)=>{
    e.preventDefault()
    const sendData = await fetch(`${process.env.REACT_APP_ServerDomain}/User/signUp`,{
      method:"POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body:JSON.stringify(Signup)
    })
    const data = await sendData.json()
    alert(data)
    if(data === "Successfully Registerd"){
      navigate("/signIn")
    }
    
    }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignUP</h1>
      <form className='flex flex-col gap-4' onSubmit={handlesubmit}>
        <input type="text" placeholder='username'className='border p-3 rounded-lg' onChange={(e)=>setSignUP({...Signup,username:e.target.value})}/>
        <input type="email" placeholder='email'className='border p-3 rounded-lg' onChange={(e)=>setSignUP({...Signup,email:e.target.value})}/>
        <input type="password" placeholder='password'className='border p-3 rounded-lg' onChange={(e)=>setSignUP({...Signup,password:e.target.value})}/>
        <button className='bg-slate-600 text-white p-3 rounded uppercase hover:opacity-95 disabled:opacity-80'>Sign UP</button>
        <OAuth/>
      </form>
      <Link to={"/signIn"}><div className='mt-4'>Have an account ? Sign IN</div></Link>
      </div>
  )
}

export default SignUP