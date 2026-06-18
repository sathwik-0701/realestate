import React from 'react';
import {Routes,Route} from 'react-router-dom';
import Landingpage from './pages/shared/Landingpage.jsx';
import Properties from './pages/shared/Properties.jsx';
import PropertyDetails from './pages/shared/PropertyDetails.jsx';
import Register from './pages/auth/Register.jsx';
import VerifyEmail from './pages/auth/VerifyEmail.jsx';
import Login from './pages/auth/Login.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import Profile from './pages/shared/Profile.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import SellerRequests from './pages/admin/SellerRequests.jsx';
import AdminProperties from './pages/admin/AdminProperties.jsx';
import AdminInquiries from './pages/admin/AdminInquiries.jsx';
import AdminContacts from './pages/admin/AdminContacts.jsx';
import SellerLayout from './components/common/SellerLayout.jsx';
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import MyProperties from './pages/seller/MyProperties.jsx';
import AddProperty from './pages/seller/AddProperty.jsx';
import EditProperty from './pages/seller/EditProperty.jsx';
import MyInquiries from './pages/seller/MyInquiries.jsx';
import ChatMessages from './pages/seller/ChatMessages.jsx';
import Contact from './pages/shared/Contact.jsx';
import Wishlist from './pages/shared/Wishlist.jsx';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>} />
        <Route path='/verify-email' element={<VerifyEmail/>} />
        <Route path="/" element={<Landingpage/>}/>
        <Route path="/properties" element={<Properties/>}/>
        <Route path='/property/:id' element={<PropertyDetails/>}/>
        <Route path='/profile' element={<Profile/>}/>

        <Route element={<SellerLayout/>} >
          <Route path='/dashboard' element={<SellerDashboard/>}/>
          <Route path='/my-properties' element={<MyProperties/>}/>
          <Route path='/add-property' element={<AddProperty/>}/>
          <Route path='/edit-property/:id' element={<EditProperty/>}/>
          <Route path='/inquiries' element={<MyInquiries/>}/>
        </Route>

        <Route path='/chat-messages' element={<ChatMessages/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/contact' element={<Contact/>}/>

        <Route element={<AdminLayout />}>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path="/admin/users" element={<AdminUsers/>}/>
        <Route path='/admin/seller-requests' element={<SellerRequests/>}/> 
        <Route path='/admin/properties' element={<AdminProperties/>}/>
        <Route path='/admin/inquiries' element={<AdminInquiries/>} />
        <Route path='/admin/contacts' element={<AdminContacts/>} />
        </Route>
      </Routes> 
    </div>
  );
}

export default App;