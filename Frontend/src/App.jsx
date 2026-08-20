import React from "react";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">

        <section className="max-w-7xl mx-auto px-4 py-20 text-center">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to AasPaj LifeCare Hospital
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Quality healthcare services with experienced doctors,
            modern facilities, and patient-focused care.
          </p>

          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Book an Appointment
          </button>

        </section>

      </main>

      {/* Footer */}
      {/* <Footer /> */}

    </div>
  );
}

export default App;