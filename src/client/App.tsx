import { Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/profile/Profile";
import SingUp from "./pages/singup/SingUp";
import CreateUser from "./pages/users/create-user/CreateUser";
import { ChangeAvatar } from "./pages/profile/change-avatar/Change-avatar";
import ChangePassword from "./pages/profile/change-password/Change-password";
import ChangeEmail from "./pages/profile/change-email/ChangeEmail";
import Dashboard from "./pages/dashboard/Dashboard";
import LayoutWithHeader from "./components/LayoutWithHeader";
import Users from "./pages/users/Users";
import EditUser from "./pages/users/edit-user/EditUser";
import DeleteUser from "./pages/users/delete-user/DeleteUser";
import IForgotMyPassword from "./pages/i-forgot-my-password/IForgotMyPassword";
import ProtectedIForgotMyPassword from "./pages/i-forgot-my-password/components/ProtectedIForgotMyPassword";
import ReceiveTokenForCreateUser from "./pages/recive-token-for-create-user/ReceiveTokenForCreateUser";
import EditEmailOfUser from "./pages/users/edit-email/EditEmail";
import ReciveTokenForUpdateEmail from "./pages/recive-token-for-update-email/ReceiveTokenForUpdateEmail";
import { ChangeAvatarOfUser } from "./pages/users/change-avatar/ChangeAvatarUser";
import ProtectedWithUserId from "./components/ProtectedWithUserId";
import NotFound from "./pages/not-found/NotFound";

function App() {
  return (
        <Routes>
          <Route path="/" element={<LayoutWithHeader />}>
          <Route path="/*" element={<NotFound />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            } />
          <Route path="/login" element={<Login />} />
          <Route path="/singup" element={<SingUp />} />
          <Route path="/receive-token-for-create-user" element={<ReceiveTokenForCreateUser />} />
          <Route path="/receive-token-for-update-email" element={<ReciveTokenForUpdateEmail />} />
          <Route path="/i-forgot-my-password" element={
          <ProtectedIForgotMyPassword>
            <IForgotMyPassword />
          </ProtectedIForgotMyPassword>
          } />
          </Route>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } >
            <Route path="/dashboard/"></Route>
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/users/create" element={<CreateUser />} />
            <Route path="/dashboard/users" element={<ProtectedWithUserId />} >
              <Route path="/dashboard/users/edit" element={<EditUser />} />
              <Route path="/dashboard/users/delete" element={<DeleteUser />} />
              <Route path="/dashboard/users/change-avatar" element={<ChangeAvatarOfUser />} />
              <Route path="/dashboard/users/change-email" element={<EditEmailOfUser />} />
            </Route>
            <Route path="/dashboard/profile" element={<Profile/>} />
            <Route path="/dashboard/profile/change-avatar" element={<ChangeAvatar/>} />
            <Route path="/dashboard/profile/change-password" element={<ChangePassword/>} />
            <Route path="/dashboard/profile/change-email" element={<ChangeEmail/>} />
          </Route>
        </Routes>
  );
}

export default App;
