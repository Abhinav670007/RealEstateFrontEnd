import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
function Listing() {
    SwiperCore.use([Navigation])
const params = useParams()
const [listing, setListing] = useState(null)
const [error, setError] = useState(false)
const [loading, setLoading] = useState(false)
console.log(listing);

useEffect(()=>{
    const fetchlisting = async ()=>{
        try {
            setLoading(true)
            const res = await fetch(`${process.env.REACT_APP_ServerDomain}/listing/getList/${params.listingId}`)
        const data = await res.json()
        if(data.success === false){
            setError(true)
            setLoading(false)

            return
        }
        setListing(data)
        setLoading(false)
            
        } catch (error) {
            setError(true)
            setLoading(false)
            setError(false)
        }
        
    }
    fetchlisting()
},[params.listingId])
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error &&(
         <p className='text-center my-7 text-2xl'>something went wrong</p>
         )}
        {listing && !loading && !error && (<div>
        <Swiper navigation>
            {listing.imageUrls?.map((Url)=>(
                <SwiperSlide key={Url}>
                <div className="h-[550px]" style={{ background: `url(${Url}) center no-repeat`, backgroundSize:'cover'}}></div>
                </SwiperSlide>
            ))}
        </Swiper>
        

        </div>
         
       ) }
    </main>
  )}

export default Listing