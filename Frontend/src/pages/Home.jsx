import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import pic from "../assets/images/hospital.png"; // Adjust the path as necessary


const Home = () => {
    const navigate = useNavigate();

    return (
        <div>

            {/* Hero Section */}
            <section id="home" className="bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">


                        {/* Left Content */}
                        <div>
                            <p className="text-blue-600 font-semibold mb-3">
                                Welcome to AasPaj HealthCare
                            </p>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                                Quality Healthcare for
                                <span className="text-blue-600"> Better Living</span>
                            </h1>

                            <p className="mt-5 text-gray-600 text-lg leading-7">
                                We provide trusted healthcare services with experienced
                                doctors, modern facilities, and patient-focused care.
                            </p>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                    Book Appointment
                                </button>

                                <button
                                    onClick={() => navigate("/doctors")}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                                >
                                    Find a Doctor
                                </button>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex justify-center">
                            <div className="bg-blue-200 rounded-2xl w-full max-w-md h-80 flex items-center justify-center">
                                <img
                                    src={pic}
                                    alt="AasPaj LifeCare Hospital Logo"
                                    className=" rounded-2xl w-full max-w-md h-80 flex items-center justify-center"
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            

        </div>
    );
};

export default Home;