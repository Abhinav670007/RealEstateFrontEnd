// import { type } from '@testing-library/user-event/dist/type'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import ListingCard from '../component/ListingCard';

function Search() {

  const navigate = useNavigate()
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  console.log(listings);
  const [sideBar, setSideBar] = useState({
    SearchTerm:'',
    type:"all",
    parking:false,
    furnished:false,
    offer:false,
    sort:'created_at',
    order:'desc',
  })
// console.log(sideBar);
useEffect(() => {
const urlParams = new URLSearchParams(window.location.search);
console.log(window.location.search);
const searchTermFromUrl = urlParams.get('SearchTerm') || '';
const typeFromUrl = urlParams.get('type') || 'all';
const parkingFromUrl = urlParams.get('parking') === 'true';
const furnishedFromUrl = urlParams.get('furnished') === 'true';
const offerFromUrl = urlParams.get('offer') === 'true';
const sortFromUrl = urlParams.get('sort') || 'createdAt';
const orderFromUrl = urlParams.get('order') || 'desc';

setSideBar({
  SearchTerm: searchTermFromUrl,
  type: typeFromUrl,
  parking: parkingFromUrl,
  furnished: furnishedFromUrl,
  offer: offerFromUrl,
  sort: sortFromUrl,
  order: orderFromUrl,
});

const fetchListing = async () => {
  setLoading(true);
  try {
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    const res = await fetch(`${process.env.REACT_APP_ServerDomain}/listing/gets?${searchQuery}`)

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json();
    setListings(data);

    if (data.length === 0) {
      console.log('No listings found.');
    } else {
      console.log('Listings found:', data);
    }
  } catch (error) {
    console.error('Error fetching listing:', error);
  } finally {
    setLoading(false);
  }
};

fetchListing();
}, [location.search,]);

const handleChange = (e) => {
const { id, value, checked } = e.target;
setSideBar((prev) => {
  if (id === 'all' || id === 'rent' || id === 'sale') {
    return { ...prev, type: id };
  }

  if (id === 'parking' || id === 'furnished' || id === 'offer') {
    return { ...prev, [id]: checked };
  }

  if (id === 'sort_order') {
    const [sort, order] = value.split('_');
    return { ...prev, sort, order };
  }

  return { ...prev, [id]: value };
});
};

const handleSubmit = (e) => {
e.preventDefault();
const urlParams = new URLSearchParams();
Object.entries(sideBar).forEach(([key, value]) => {
  urlParams.set(key, value);
});
console.log(`Navigate URL: /search?${urlParams.toString()}`);
navigate(`/search?${urlParams.toString()}`);
        }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
              <div className="flex items-center gap-2">
                <label className='whitespace-nowrap font-semibold'>Serach Term</label>
                <input value={sideBar.SearchTerm} onChange={(e)=>setSideBar({...sideBar,SearchTerm:e.target.value})} className='border rounded-lg p-3 w-full' type="text" id='searchTerm' placeholder='search....'/>
                </div>  
                <div className="flex gap-2 flex-wrap items-center">
                  <label className='font-semibold'>Type</label>
                  <div className="flex gap-2">
                    <input type="checkbox" id='all' className='w-5' onChange={handleChange} checked={sideBar.type=== 'all'}/>
                    <span>Rent & sale</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={sideBar.type === 'rent'}/>
                    <span>Rent</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={sideBar.type === 'sale'}/>
                    <span>Sale</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={sideBar.offer}/>
                    <span>offer</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <label className='font-semibold'>Amenities</label>
                  <div className="flex gap-2">
                    <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={sideBar.parking}/>
                    <span>parking</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={sideBar.furnished}/>
                    <span>Furnished</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className='font-semibold'>Sort :</label>
                  <select onChange={handleChange} defaultValue={'created_at_desc'} className='border rounded-lg p-3' id="sort_order">
                    <option value='regularPrice_desc'>Price high to low</option>
                    <option value='regularPrice_asc'>Price low to high</option>
                    <option value='regularPrice_desc'>Latest</option>
                    <option value='regularPrice_asc'>Oldest</option>
                  </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase'>Search</button>
            </form>
        </div>
        <div className="flex-1">
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results : </h1>
            <div className="p-7 flex flex-wrap gap-4">
              {!loading && listings.length === 0 && (
                <p className='text-3xl text-slate-600'>No listing found</p>
              )}
              {loading && (
                <p className='text-xl text-slate-600 text-center w-full'>Loading....</p>
              )}
              {
                !loading && listings && listings.map((listing)=>(
                  <ListingCard key={listing._id} listing={listing}/>
                ))
              }
            </div>
        </div>
    </div>
  )
}

export default Search



//(e)=>setSideBar({...sideBar,SearchTerm:e.target.value})