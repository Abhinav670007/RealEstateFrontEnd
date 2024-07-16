import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import React from 'react'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function OAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const handleGoogle = async()=>{
        try {
           const provider = new GoogleAuthProvider()
           const auth = getAuth(app) 
          const result = await signInWithPopup(auth,provider)

          const res = await fetch(`${process.env.REACT_APP_ServerDomain}/User/google`,{
            method:"POST",
            headers:{
              "Content-Type" : "application/json"
            },
            body:JSON.stringify({name :result.user.displayName,email:result.user.email,photo:result.user.photoURL}),
            credentials: 'include'
          })
          const data = await res.json()
          dispatch(signInSuccess(data))
          navigate('/')
          
        } catch (error) {
            console.log('could not sign in with google',error);
        }
    }
  return (
    <button onClick={handleGoogle} type='button' className='bg-red-600 text-white p-3 rounded uppercase hover:opacity-95 disabled:opacity-80'>Continue with Google</button>
  )
}

export default OAuth