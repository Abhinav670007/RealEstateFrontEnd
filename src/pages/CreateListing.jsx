import React, { useRef, useState } from 'react'
import { app } from '../firebase';
import { getDownloadURL, getStorage, uploadBytesResumable,ref } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CreateListing() {
    const [files, setFiles] = useState([])
  const [formData, setformData] = useState({
    imageUrls:[],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice:1,
    offer: false,
    parking: false,
    furnished: false,
  })

  const [imageUploadError, setImageUploadError] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const {currentUser} = useSelector(state=>state.user)
  const [loading, setLoading] = useState(false)
console.log(formData);
const handleImageSubmit = (e)=>{
    if(files.length >0 && files.length + formData.imageUrls.length < 7){
     const promises = []  // This array is typically used to store multiple promise objects 
    for (let i=0 ;i<files.length;i++){
        promises.push(storeImage(files[i]))
    }
    Promise.all(promises).then((urls)=>{
        setformData({...formData,imageUrls: formData.imageUrls.concat(urls)   
        })
        setImageUploadError(false)
    })
    .catch((err)=>{
        setImageUploadError('image upload failed (2 mb max per image)')
    })
    }else{
        setImageUploadError('you can only upload 6 images per listing')
    }
}

const storeImage = async (file)=>{
    return new Promise((resolve,reject)=>{
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,file)
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`upload is ${progress}% done`);
          },
        (error)=>{
            reject(error)
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                resolve(downloadURL)
            })
        }
    )
    })
}
        const handleRemoveImage =(index)=>{
        setformData({
            ...formData,
            imageUrls : formData.imageUrls.filter((_,i)=>i !== index)
        })
        }

      const handleChange = (e)=>{
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setformData({
              ...formData,
              type: e.target.id,
            });
          } 
          if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
          ) {
            setformData({
              ...formData,
              [e.target.id]: e.target.checked,
            });
          }
          if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
          ) {
            setformData({
              ...formData,
              [e.target.id]: e.target.value,
            });
          }
      } 
      const handleSubmit = async(e)=>{
        e.preventDefault()
          try {
            if(formData.imageUrls.length < 1) return setError('you must upload at least one image')
            setLoading(true)
            setError(false)

            const res = await fetch(`${process.env.REACT_APP_ServerDomain}/listing/Create`,{
                method:"POST",
                headers:{
                  "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    ...formData,
                    useRef:currentUser._id
                }),
                 credentials: 'include'
            })
            const data = await res.json()
            setLoading(false)
            if(data.success === false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
          } catch (error) {
            setError(error.message)
            setLoading(false)
          }  
      } 

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input onChange={handleChange} value={formData.name} type="text" placeholder='name' className='border p-3 rounded-lg' id='name' maxLength={63} minLength={10} required />
                <textarea onChange={handleChange} value={formData.description} type="text" placeholder='description' className='border p-3 rounded-lg' id='description' required />
                <input onChange={handleChange} value={formData.address} type="text" placeholder='address' className='border p-3 rounded-lg' id='address' required />
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className='w-5' onChange={handleChange} checked={formData.type === 'sale'}/>
                        <span>sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="Rent" className='w-5' onChange={handleChange} checked={formData.type === 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.parking} type="checkbox" id="parking" className='w-5'/>
                        <span>parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.furnished} type="checkbox" id="furnished" className='w-5'/>
                        <span>furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.offer} type="checkbox" id="offer" className='w-5'/>
                        <span>offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} checked={formData.bedrooms} type="number"id='bedrooms' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg'/>
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} checked={formData.bathrooms} type="number"id='bathrooms' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg'/>
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={formData.regularPrice} type="number"id='regularPrice' min={50} max={10000} required className='p-3 border border-gray-400 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Regular price</p>
                            <span className='text-sm'>$ / month</span>
                            </div>
                    </div>
                    {formData.offer && (
                        <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={formData.discountPrice} type="number"id='discountPrice' min={10} max={100000} required className='p-3 border border-gray-400 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Discount Price</p>
                            <span className='text-sm'>$ / month</span>
                            </div>
                    </div>)}  
                </div>
                
            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className='font-normal text-gray-700 ml-2'>images :
                    <span>The first image will be the cover (max-6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e)=>{setFiles(e.target.files)}} className='p-3 border border-gray-400 rounded w-full' type="file" id='images' accept='/image/*' multiple />
                    <button type='button' onClick={handleImageSubmit} className='p-3 w-28 text-green-700 border border-green-500 rounded uppercase'>Upload</button>
                </div>
                <p className='text-red-600'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
                     <div key={url} className="flex justify-between p-3 border items-center">
                     <img src={url} alt="listing images" className='w-40 h-40 object-cover rounded-lg'/>
                     <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-600 rounded-lg uppercase hover:opacity-65'>Delete</button>

                    </div>
                    ))
                }
                <button className='p-3 bg-slate-600 text-white rounded-lg uppercase'>{loading ? 'Creating....' : 'Create Listing'}</button>
                <p className='text-red-600'>{error}</p>
            </div>
        </form>
    </main>
  )
}

export default CreateListing