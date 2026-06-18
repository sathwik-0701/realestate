import express from 'express';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { 
  approveSeller, 
  blockUser, 
  deleteUser, 
  getAllInquiries, 
  getAllProperties, 
  getAllUsers, 
  getDashboardStats, 
  getPendingSellers,
  deleteInquiry,
  updateInquiryStatus,
  getRecentProperties,
  getAllContacts,
  markContactAsRead,
  deleteContact
} from '../controllers/admin.controller.js';
import { deleteProperty } from '../controllers/property.controller.js';

const adminRouter = express.Router();

adminRouter.use(protect, authorize("admin"));

// User routes
adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id/block", blockUser);
adminRouter.delete("/users/:id", deleteUser);

// Property routes
adminRouter.get("/properties", getAllProperties);
adminRouter.delete("/properties/:id", deleteProperty);
adminRouter.get("/recent-properties", getRecentProperties);

// Inquiry routes
adminRouter.get("/inquiries", getAllInquiries);
adminRouter.delete("/inquiries/:id", deleteInquiry);
adminRouter.patch("/inquiries/:id/status", updateInquiryStatus);

// Contact routes
adminRouter.get("/contacts", getAllContacts);
adminRouter.patch("/contacts/:id/read", markContactAsRead);
adminRouter.delete("/contacts/:id", deleteContact);

// Stats
adminRouter.get("/stats", getDashboardStats);

// Seller routes
adminRouter.get("/pending-sellers", getPendingSellers);
adminRouter.patch("/approve-seller/:id", approveSeller);

export default adminRouter;