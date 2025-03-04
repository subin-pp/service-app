import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";

import LoginPage from "./pages/authorization/LoginPage";
import CreateAccountPage from "./pages/authorization/CreateAccountPage";
import SplashPage from "./pages/authorization/SplashPage";
import SelectUserType from "./pages/authorization/SelectUserType";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminUserManage from "./pages/admin/AdminUserManage";
import AdminWorkerManage from "./pages/admin/AdminWorkerManage";
import WorkerForm from "./pages/worker/WorkerForm";
import UserHomPage1 from "./pages/user/UserHomPage1";
import WorkerHomePage1 from "./pages/worker/WorkerHomePage1";
import WorkerHistory from "./pages/worker/WorkerHistory";
import WorkerVerification from "./pages/admin/WorkerVerification";
import UserBookings from "./pages/user/userBookings";
import { WorkerProvider } from "./WorkerContext1";

function App() {
  return (
    <WorkerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/select-user-type" element={<SelectUserType />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />

          <Route path="/user-home" element={<UserHomPage1 />} />
          <Route path="/user-bookings" element={<UserBookings />} />

          <Route path="/worker-home" element={<WorkerHomePage1 />} />
          <Route path="/worker/history" element={<WorkerHistory />} />
          <Route path="/worker-form" element={<WorkerForm />} />

          <Route path="/admin-home" element={<AdminHomePage />} />
          <Route path="/admin-home/user" element={<AdminUserManage />} />
          <Route path="/admin-home/worker" element={<AdminWorkerManage />} />
          <Route path="/admin-home/worker-verification" element={<WorkerVerification />} />
        </Routes>
      </BrowserRouter>
    </WorkerProvider>
  );
}

export default App;
