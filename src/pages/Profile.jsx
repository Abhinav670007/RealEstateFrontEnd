import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { app } from '../firebase'
import { updateUserError, updateUserStart } from '../redux/userSlice'

function Profile() {

  const fileRef = useRef(null)
  const {currentUser} = useSelector((state)=>state.user)
  const [file, setfile] = useState(undefined)
  const [filepercentage, setfilePercentage] = useState(0)
  const [fileError, setfileError] = useState(false)
  const [formData, setFormData] = useState({})
const dispatch = useDispatch()  

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])

  const handleFileUpload = (file)=>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file)

    //uploading percentage
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePercentage(Math.round(progress));
      },
      (error) => {
        setfileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        });
      }
    );
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`${process.env.REACT_APP_ServerDomain}/User/update/${currentUser._id}`,{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.sccess === false){
        dispatch(updateUserError(data.message))
      }
      dispatch(updateUserStart(data))
    } catch (error) {
      dispatch(updateUserError(error.message))
    }
  }
 
   return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setfile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/.*'/>
        <img src={formData.avatar || currentUser.avatar} onClick={()=>fileRef.current.click()} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileError ? (
            <span className='text-red-400'>Error image upload</span>
          ):filepercentage > 0 && filepercentage < 100 ? (
            <span className='text-slate-400'>{`Uploading ${filepercentage}%`}</span>
          ): filepercentage ===100?(
            <span className='text-green-500'>image successfull uploaded !</span>
          ):(
            ''
          )

          }
        </p>
      <input onChange={(e)=>setFormData({...FormData,username:e.target.value})} id='username' type="text" placeholder='username' className='border p-3 rounded-lg' defaultValue={currentUser.username}/>
      <input onChange={(e)=>setFormData({...FormData,email:e.target.value})} id='email' type="email" placeholder='email' className='border p-3 rounded-lg' defaultValue={currentUser.email}/>
      <input onChange={(e)=>setFormData({...FormData,password:e.target.value})} id='password' type="text" placeholder='password' className='border p-3 rounded-lg' />
      <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>
    </div>
  )
}

export default Profile


//firebase Storage
// ------------------
// allow read;
// allow write: if
// request.resource.size < 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')