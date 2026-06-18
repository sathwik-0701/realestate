import User from "../models/user.model.js";
import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";
import Contact from "../models/contact.model.js";

// View all Users
export const getAllUsers = async (req, res) => {
  try {
     const users = await User.find().select("-password");
     res.json({
        success: true,
        count: users.length,
        users
     });
  } 
  catch (err) {
    res.status(500).json({
        message: err.message
    });
  }   
}

// Block a particular user
export const blockUser = async(req,res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            success: true,
            message: user.isBlocked ? "User Blocked" : "User Unblocked",
            isBlocked: user.isBlocked
        });
    } 
    catch (err) {
    res.status(500).json({
        message: err.message
    });
    }
}

// to delete a particular user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } 
    catch (error) {
    res.status(500).json({
        message: error.message
    });
    }
}

// View all properties
export const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate("seller","name email");
        res.json({
            success: true,
            count: properties.length,
            properties
        });
    } catch (err) {
    res.status(500).json({
        message: err.message
    });
    }
}

// to delete a particular property
export const deleteProperty = async (req, res) => {
  try {
   await Property.findByIdAndDelete(req.params.id);
   res.json({
    success: true,
    message: "Property Deleted successfully!"
   })  
  } 
  catch (err) {
    res.status(500).json({
        message: err.message
    });
    }   
}

// view all inquiries
export const getAllInquiries = async (req, res) => {
    try {
       const inquiries = await Inquiry.find()
       .populate("buyer", "name email phone")
       .populate("seller", "name email phone")
       .populate("property", "title price images location")
       .sort({createdAt: -1});

       res.json({
        success: true,
        count: inquiries.length,
        inquiries
       });
    } 
    catch (error) {
    res.status(500).json({
        message: error.message
    });
    }
}

// Delete Inquiry
export const deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        
        const inquiry = await Inquiry.findByIdAndDelete(id);
        
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found"
            });
        }
        
        res.json({
            success: true,
            message: "Inquiry deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting inquiry:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete inquiry"
        });
    }
};

// Update Inquiry Status
export const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['new', 'read', 'replied'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'new', 'read', or 'replied'"
            });
        }
        
        const inquiry = await Inquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
        .populate("buyer", "name email phone")
        .populate("seller", "name email phone")
        .populate("property", "title price images location");
        
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found"
            });
        }
        
        res.json({
            success: true,
            inquiry,
            message: "Inquiry status updated successfully"
        });
    } catch (error) {
        console.error("Error updating inquiry status:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update inquiry status"
        });
    }
};

// Dashboard analytics
export const getDashboardStats = async(req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const activeListings = await Property.countDocuments({
            status: "sale"
        });

        const soldProperties = await Property.countDocuments({
            status: "sold"
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProperties,
                activeListings,
                soldProperties
            }
        })
    } 
    catch (error) {
    res.status(500).json({
        message: error.message
    });
    }
}

// to get pending seller account
export const getPendingSellers = async (req, res) => {
    try {
       const pendingSeller = await User.find({
        role: "seller",
        isApproved: false
       }).select("-password");

       res.json({
        success: true,
        count: pendingSeller.length,
        pendingSeller
       });

    } 
   catch (err) {
    res.status(500).json({
        message: err.message
    });
  }
}

// to approve a particular seller
export const approveSeller = async (req, res) => {
    try {
    const seller = await User.findById(req.params.id);
    if(!seller || seller.role !== "seller")
        {
           return res.status(404).json({
            success: false,
            message: "You are not a seller or seller not found."
           });
        }   
         seller.isApproved = true;
         await seller.save();

         res.json({
            success: true,
            message: "seller approved Successfully!",
            seller
         })
    } 
    catch (err) {
    res.status(500).json({
        message: err.message
    });
  }
}

// ==================== RECENT PROPERTIES WITH SELLER INFO ====================
export const getRecentProperties = async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('seller', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            properties
        });
    } catch (error) {
        console.error("Error fetching recent properties:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== CONTACT MANAGEMENT ====================
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: contacts.length,
            contacts
        });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch contacts"
        });
    }
};

export const markContactAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const contact = await Contact.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }
        
        res.json({
            success: true,
            contact,
            message: "Contact marked as read"
        });
    } catch (error) {
        console.error("Error marking contact as read:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to mark contact as read"
        });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        
        const contact = await Contact.findByIdAndDelete(id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }
        
        res.json({
            success: true,
            message: "Contact deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete contact"
        });
    }
};