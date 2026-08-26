import doctor1 from "../assets/images/doctor1.avif";
import doctor2 from "../assets/images/doctor2.jpg";
import doctor3 from "../assets/images/doctor3.avif";
import doctor4 from "../assets/images/doctor4.jpg";

const doctors = [
  {
    name: "Dr. Ram Sharma",
    specialty: "Cardiologist",
    experience: "10+ Years Experience",
    image: doctor1,
  },
  {
    name: "Dr. Sita Thapa",
    specialty: "Gynecologist",
    experience: "8+ Years Experience",
    image: doctor2,
  },
  {
    name: "Dr. Hari Adhikari",
    specialty: "Neurologist",
    experience: "12+ Years Experience",
    image: doctor3,
  },
  {
    name: "Dr. Anjali Gurung",
    specialty: "Pediatrician",
    experience: "7+ Years Experience",
    image: doctor4,
  },
];

const Doctors = () => {
  return (
    <section className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Page Heading */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-lg">
            Our Medical Team
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
            Meet Our Doctors
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Our experienced and dedicated doctors are committed to providing
            quality healthcare and personalized treatment to every patient.
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >

              {/* Doctor Image */}
              <div className="h-56 bg-blue-100">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Doctor Information */}
              <div className="p-6 text-center">

                <h2 className="text-xl font-bold text-gray-800">
                  {doctor.name}
                </h2>

                <p className="text-blue-600 font-medium mt-2">
                  {doctor.specialty}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  {doctor.experience}
                </p>

                <button
                  className="mt-5 w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
                >
                  View Profile
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Doctors;