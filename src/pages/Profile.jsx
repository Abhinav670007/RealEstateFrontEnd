import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { app } from '../firebase'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserError, updateUserStart, updateUserSuccess } from '../redux/userSlice'
import { Link } from 'react-router-dom'
function Profile() {

  const fileRef = useRef(null)
  const {currentUser,loading} = useSelector((state)=>state.user)
  const [file, setfile] = useState(undefined)
  const [filepercentage, setfilePercentage] = useState(0)
  const [fileError, setfileError] = useState(false)
  const [formData, setFormData] = useState({})
  const [UpdateSucess, setUpdateSucess] = useState(false)
  const [listingError, setListingError] = useState(false)
  const [userListing, setUserListing] = useState([])
const dispatch = useDispatch()  
console.log(userListing);

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
          "Content-Type" : "application/json"
        },
        body:JSON.stringify(formData),
        credentials: 'include'
      })
      const data = await res.json()
      if(data.sccess === false){
        dispatch(updateUserError(data.message))
      }
      dispatch(updateUserSuccess(data))
      setUpdateSucess(true)
    } catch (error) {
      dispatch(updateUserError(error.message))
    }
  }
  const handleDeleteUser= async ()=>{
      try {
        dispatch(deleteUserStart())
       const res = await fetch(`${process.env.REACT_APP_ServerDomain}/User/update/${currentUser._id}`,{
        method:"DELETE",
        credentials: 'include'
      })
      const data = res.json()
      if(data.sccess === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
         dispatch(deleteUserSuccess(data))
        
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
  }

  const handleShowListing = async ()=>{
    try {
      setListingError(false)
      const res = await fetch(`${process.env.REACT_APP_ServerDomain}/listing/get/${currentUser._id}`,{
         method:"GET",
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success === false){
        setListingError(true)
        return
      }
      setUserListing(data)
    } catch (error) {
      setListingError(true)
    }
  }

  const handleListingDelete =async (listingId)=>{
    try {
      const res = await fetch(`${process.env.REACT_APP_ServerDomain}/listing/deleteList/${listingId}`,{
        method:"DELETE",
       credentials: 'include'
     })
      const data = await res.json()
      console.log(data);
      if(data.success === false ){
        console.log(data.message);
      }
      setUserListing((prev)=>prev.filter((listing)=>listing._id !== listingId))
    } catch (error) {
      console.log(error.message);
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
      <input onChange={(e)=>setFormData({...FormData,password:e.target.value})} id='password' type="password" placeholder='password' className='border p-3 rounded-lg' />
      <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
        {loading?'Loadind...':'update'}
      </button>
      <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center' to={'/create-listing'}>Create listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign Out
        </span>
      </div>
      {/* <p className='text-red-700'>{error ?error:""}</p> */}
      <p className='text-green-700 mt-3'>{UpdateSucess?'successfully updated!':""}</p>
          <button onClick={handleShowListing} className='text-green-600 w-full'>Show Listing</button>
          {userListing &&
           userListing.length >0 &&
           <div className='flex flex-col gap-4'>
             <h1 className='text-center mt-7 text-2xl'>Your Listing</h1>
             { userListing.map((listing)=>(
                <div key={listing._id} className="border rounded-lg p-3 flex justify-evenly items-center gap-4">
                  <Link to={'/listing'}>
                  
                  <img className='h-16 w-16 object-contain' src={listing.imageUrls[0]} alt="cover" />
                  </Link >
                  <Link className='text-slate-600 font-semibold hover:underline truncate flex-1' to={'/listing'}>
                    <p>{listing.name}</p>
                  </Link>
  
                  <div className="flex flex-col items-center">
                <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700'>Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
                  <button  className='text-green-700'>Edit</button>
  
              </Link>  
                  </div>
  
                </div>
               ))}
           </div>
         
         }
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