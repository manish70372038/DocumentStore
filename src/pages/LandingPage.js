import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
// import { useAppState } from '../Context/AppStateContext';
// import Toast from '../components/Toast';


const LandingPage = () => {
  // const {toast,setToast} = useAppState()
  return (
    <div  className='landingpage-container'>
     <Navbar/>
     <Hero/>
      {/* {toast.show && (
  <Toast 
    message={toast.message} 
    type={toast.type} 
    onClose={() => setToast({...toast, show: false})}
  />
)} */}
    </div>
  );
};

export default LandingPage; 