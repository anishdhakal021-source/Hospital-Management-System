import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/new" element={<CreatePatient />} />
          <Route path="/patients/:id" element={<PatientDetails />} />

          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/new" element={<CreateDepartment />} />
          <Route path="/departments/:id/edit" element={<EditDepartment />} />

          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/new" element={<CreateDoctor />} />
          <Route path="/doctors/:id/edit" element={<EditDoctor />} />

          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/new" element={<CreateAppointment />} />

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