import React from 'react'

function CreateListing() {
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
                    <input className='p-3 border border-gray-400 rounded w-full' type="file" id='images' accept='/image/*' multiple />
                    <button className='p-3 w-28 text-green-700 border border-green-500 rounded uppercase'>Upload</button>
                </div>
                <button className='p-3 bg-slate-600 text-white rounded-lg uppercase'>Create Listing</button>

            </div>
        </form>
    </main>
  )
}

export default CreateListing