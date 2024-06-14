import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUP from './pages/SignUP';
import Header from './component/Header';
function App() {

  return (
    <div className="App">
     <BrowserRouter>
     <Header/>
     <Routes>
      <Route path='/'element={<Home/>}/>
      <Route path='/about'element={<About/>}/>
      <Route path='/profile'element={<Profile/>}/>
      <Route path='/signIn'element={<SignIn/>}/>
      <Route path='/signUP'element={<SignUP/>}/>

     </Routes>
     
     </BrowserRouter>
    </div>
  );
}

export default App;
