import express from 'express';
import { addProperty, deleteProperty, getAllProperties, getMyProperties, getPropertyCounts, getPropertyById, getSellerDashboard, updateProperty, updatePropertyStatus } from '../controllers/property.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const propertyRouter = express.Router();

propertyRouter.get("/", getAllProperties);
propertyRouter.post("/", protect, authorize("seller"), upload.array("images",10), addProperty);
propertyRouter.get("/my", protect, authorize("seller"), getMyProperties);
propertyRouter.get("/counts", getPropertyCounts);                                        
propertyRouter.get("/seller/dashboard", protect, authorize("seller"), getSellerDashboard);
propertyRouter.put("/:id", protect, authorize("seller"), upload.array("images",10), updateProperty);
propertyRouter.delete("/:id", protect, authorize("seller"), deleteProperty);
propertyRouter.patch("/:id/status", protect, authorize("seller"), updatePropertyStatus); 
propertyRouter.get("/:id", getPropertyById);                                             

export default propertyRouter;