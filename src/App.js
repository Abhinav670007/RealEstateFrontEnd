import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUP from './pages/SignUP';
import Header from './component/Header';
import Privaterouter from './component/Privateroute'
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
function App() {

  return (
    <div className="App">
     <BrowserRouter>
     <Header/>
     <Routes>
      <Route path='/'element={<Home/>}/>
      <Route path='/about'element={<About/>}/>
      <Route path='/signIn'element={<SignIn/>}/>
      <Route path='/search'element={<Search/>}/>
      <Route path='/listing/:listingId'element={<Listing/>}/>
      <Route path='/signUP'element={<SignUP/>}/>
      <Route element={<Privaterouter/>}>
      <Route path='/profile'element={<Profile/>}/>
      <Route path='/create-listing'element={<CreateListing/>}/>
      <Route path='/update-listing/:listingId'element={<UpdateListing/>}/>
      </Route>
     </Routes>
     
     </BrowserRouter>
    </div>
  );
}

export default App;
