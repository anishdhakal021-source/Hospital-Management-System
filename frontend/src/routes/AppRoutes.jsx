import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";
// import RoleRoute from "./RoleRoute";
import Patients from "../pages/Patients/Patients";
import CreatePatient from "../pages/Patients/CreatePatient";
import PatientDetails from "../pages/Patients/PatientDetails";
import Departments from "../pages/Departments/Departments";
import CreateDepartment from "../pages/Departments/CreateDepartment";
import EditDepartment from "../pages/Departments/EditDepartment";
import Doctors from "../pages/Doctors/Doctors";
import CreateDoctor from "../pages/Doctors/CreateDoctor";
import EditDoctor from "../pages/Doctors/EditDoctor";
import Appointments from "../pages/Appointments/Appointments";
import CreateAppointment from "../pages/Appointments/CreateAppointment";
import MedicalRecords from "../pages/medical-records/MedicalRecords";
import MedicalRecordDetails from "../pages/medical-records/MedicalRecordDetails";
import CreateMedicalRecord from "../pages/medical-records/CreateMedicalRecord";
import EditMedicalRecord from "../pages/medical-records/EditMedicalRecord";
import Prescriptions from "../pages/Prescriptions/Prescriptions";
import PrescriptionDetails from "../pages/Prescriptions/PrescriptionDetails";
import EditPrescription from "../pages/Prescriptions/EditPrescription"
import CreatePrescriptionItem from "../pages/Prescriptions/CreatePrescriptionItem";
import EditPrescriptionItem from "../pages/Prescriptions/EditPrescriptionItem";
import CreatePrescription from "../pages/Prescriptions/CreatePrescription";
import Medicines from "../pages/Medicine/Medicines";
import CreateMedicine from "../pages/Medicine/CreateMedicine";
import EditMedicine from "../pages/Medicine/EditMedicine";
import MedicineBatches from "../pages/Medicine/MedicineBatches";
import CreateMedicineBatch from "../pages/Medicine/CreateMedicineBatch";

const SectionEntry = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <AppLayout>{children}</AppLayout> : <Home />;
};

const DepartmentsEntry = () => (
  <SectionEntry>
    <Departments />
  </SectionEntry>
);

const DoctorsEntry = () => (
  <SectionEntry>
    <Doctors />
  </SectionEntry>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Home />} />
      <Route path="/departments" element={<DepartmentsEntry />} />
      <Route path="/doctors" element={<DoctorsEntry />} />
      <Route path="/about" element={<Home />} />
      <Route path="/contact" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/new" element={<CreatePatient />} />
          <Route path="/patients/:id" element={<PatientDetails />} />

          <Route path="/departments/new" element={<CreateDepartment />} />
          <Route path="/departments/:id/edit" element={<EditDepartment />} />

          <Route path="/doctors/new" element={<CreateDoctor />} />
          <Route path="/doctors/:id/edit" element={<EditDoctor />} />

          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/new" element={<CreateAppointment />} />

          <Route path="/medical-records/" element={<MedicalRecords />} />
          <Route path="/medical-records/new/" element={<CreateMedicalRecord />} />
          <Route path="/medical-records/:id/" element={<MedicalRecordDetails />} />
          <Route path="/medical-records/:id/edit/" element={<EditMedicalRecord />} />

          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/prescriptions/new" element={<CreatePrescription />} />
          <Route path="/prescriptions/:id" element={<PrescriptionDetails />} />
          <Route path="/prescriptions/:id/edit" element={<EditPrescription />} />

          <Route path="/prescriptions/:id/items/new" element={<CreatePrescriptionItem />} />
          <Route path="/prescriptions/:id/items/:itemId/edit" element={<EditPrescriptionItem />} />

          <Route path="/medicines" element={<Medicines />}/>
          <Route path="/medicines/new" element = {<CreateMedicine />}/>
          <Route path="/medicines/:id/edit" element = {<EditMedicine />}/>


          <Route path="/medicine-batches" element = {<MedicineBatches />}/>
          <Route path="/medicine-batches/new" element = {<CreateMedicineBatch />}/>
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">
              Page not found
            </h1>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;