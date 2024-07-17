import React, { useState } from 'react'
import { app } from '../firebase';
import { getDownloadURL, getStorage, uploadBytesResumable,ref } from 'firebase/storage';

function CreateListing() {
    const [files, setFiles] = useState([])
  const [formData, setformData] = useState({
    imageUrls:[]
  })

  const [imageUploadError, setImageUploadError] = useState(false)
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
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='name' className='border p-3 rounded-lg' id='name' maxLength={63} minLength={10} required />
                <textarea type="text" placeholder='description' className='border p-3 rounded-lg' id='description' required />
                <input type="text" placeholder='address' className='border p-3 rounded-lg' id='address' required />
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className='w-5'/>
                        <span>sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="Rent" className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className='w-5'/>
                        <span>parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className='w-5'/>
                        <span>furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className='w-5'/>
                        <span>offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input type="number"id='bedrooms' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg'/>
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number"id='bathrooms' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg'/>
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number"id='regularPrice' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Regular price</p>
                            <span className='text-sm'>$ / month</span>
                            </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number"id='discountPrice' min={1} max={10} required className='p-3 border border-gray-400 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Discount Price</p>
                            <span className='text-sm'>$ / month</span>
                            </div>
                    </div>
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
                <button className='p-3 bg-slate-600 text-white rounded-lg uppercase'>Create Listing</button>

            </div>
        </form>
    </main>
  )
}

export default CreateListing