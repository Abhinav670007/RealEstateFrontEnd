import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Contact({listing}) {

  const [landOwner, setlandOwner] = useState(null)
  const [message, setMessage] = useState(' ')

console.log(landOwner);
  useEffect(()=>{
    const fetchLandOwner = async ()=>{
      try {
        const res = await fetch(`${process.env.REACT_APP_ServerDomain}/listing/${listing.useRef}`,
          {
            // method:"GET",
            // headers:{
            //   "Content-Type" : "application/json"
            // },
            credentials: 'include'
          }
        )
        const data = await res.json()
        setlandOwner(data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandOwner()
  },[listing.useRef])
  const contactOwner = (e)=>{
   message(setMessage)
  }
  return (
    <div>
      {landOwner &&(
        <div className="flex flex-col gap-2">
          <p>Contact <span className='font-semibold '>{landOwner.username} for <span className='font-semibold '>{listing.name.toLowerCase()}</span></span></p>
        </div>
      )}
      <p><textarea name="message" id="message" rows="2" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder='enter ypur message' className='w-full border p-3 rounded-lg'></textarea></p>
      <Link to={`mailto:${landOwner?.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase'>Send message</Link>
    </div>
  )
}

export default Contact