import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Navbar />
      <h1 className="text-4xl font-bold text-blue-600">
        AasPaj LifeCare Hospital
      </h1>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
