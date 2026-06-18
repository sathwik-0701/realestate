import express from 'express';
import Chat from '../models/chat.model.js';
import { protect } from '../middlewares/auth.middleware.js';

const chatRouter = express.Router();                              // ✅ chatRouter was never defined

// to create a chat
chatRouter.post("/start", protect, async(req, res) => {          // ✅ added protect
    try {
     const {propertyId, sellerId, buyerId: providedBuyerId } = req.body;
     let buyerId, finalSellerId;
     if(req.user.role === "seller")
        {
            buyerId = providedBuyerId;
            finalSellerId = req.user._id;
        } else {
            buyerId = req.user._id;
            finalSellerId = sellerId;
        }
        if(!buyerId || !finalSellerId)
        {
            return res.status(400).json({
                message: "Missing buyer or seller Id"
            });
        }

        let chat = await Chat.findOne({
            buyer: buyerId,
            seller: finalSellerId
        });
        if(!chat)
        {
            chat = await Chat.create({
                property: propertyId,
                buyer: buyerId,
                seller: finalSellerId,
                message: []
            });
        }
        chat = await Chat.findById(chat._id)
        .populate("buyer", "name email profilePic")
        .populate("seller", "name email profilePic")
        .populate("property", "title price images");
        res.json(chat);
    } 
    catch (err) {
      res.status(500).json({
        message: "Error creating chat or getting previous one",
        error: err.message
      });
    }
});

// to send message
chatRouter.post("/send", protect, async (req, res) => {          // ✅ added protect
    try {
        const {chatId, text, images} = req.body;
        const userId = req.user._id;                             // ✅ was req.user.id

        const chat = await Chat.findById(chatId);                // ✅ was chaId (typo)
        if(!chat) return res.status(404).json({
            message: "Chat not found"
        });
        
        if(chat.buyer.toString() !== userId.toString() && chat.seller.toString() !== userId.toString())
        {
            return res.status(403).json({
                message: "Not authorized to send message in this chat"
            });
        }

        const newMessage = {
            sender: userId,
            text,
            image: images,                                       // ✅ was image (not defined)
            createdAt: new Date()
        };

        chat.message.push(newMessage);
        await chat.save();

        const savedMessage = chat.message[chat.message.length - 1];
        res.json({chat, newMessage: savedMessage});
    } 
    catch (err) {
         res.status(500).json({
            message: "Error sending message",
            error: err.message
         });
    }
});

// to get chats for user
chatRouter.get("/user", protect, async(req,res) => {             // ✅ added protect
    try {
       const userId = req.user._id;
       const chats = await Chat.find({                           // ✅ removed misplaced dot
        $or : [{buyer: userId}, {seller: userId}]
       })
        .populate("buyer", "name email profilePic")
        .populate("seller", "name email profilePic")
        .populate("property", "title price images")
        .sort({updatedAt: -1});

        res.json(chats);
    } 
    catch (err) {
         res.status(500).json({
            message: "Error fetching user chat",
            error: err.message
         });
    }
});

// to get chat messages
chatRouter.get("/:chatId", protect, async (req,res) => {         // ✅ added protect
    try {
     const chat = await Chat.findById(req.params.chatId).populate(
        "message.sender",                                        // ✅ was messages.sender
        "name profilePic"
     );
     
     if(!chat) return res.status(404).json({message: "Chat not found"});

     const userId = req.user._id.toString();
     if(chat.buyer.toString() !== userId && chat.seller.toString() !== userId)
     {
        return res.status(403).json({
            message: "You are not authorized"
        });
     }
     res.json(chat);                                             // ✅ was missing response
    } 
    catch (err) {
         res.status(500).json({
            message: "Error fetching chat messages",
            error: err.message
         });
    }
});

// to delete an entire chat
chatRouter.delete("/:chatId", protect, async (req,res) => {      // ✅ added protect
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);     // ✅ was chat.findById

         if(!chat) return res.status(404).json({message: "Chat not found"});

         if(chat.buyer.toString() !== userId.toString() &&
        chat.seller.toString() !== userId.toString())
        {
            return res.status(403).json({message: "Not Authorized"});
        }
        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({message: "Chat deleted successfully!" });
    } 
    catch (err) {
         res.status(500).json({
            message: "Error deleting chat",
            error: err.message
         });
    }
});

// to delete a specific message
chatRouter.delete("/:chatId/message/:messageId", protect, async(req, res) => { // ✅ added protect
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);     // ✅ was chat.findById

        if(!chat) return res.status(404).json({message: "Chat not found"});

        const message = chat.message.id(req.params.messageId);  // ✅ was chat.findById
        if(!message) return res.status(404).json({message: "Message not found"}); // ✅ was !chat

       if(message.sender.toString() !== userId.toString())
       {
        return res.status(403).json({
            message: "Not Authorized to delete this message"
        });
       }
       chat.message.pull(req.params.messageId);
       await chat.save();
       res.json({message: "Message deleted successfully!", chat});
    } 
    catch (err) {
         res.status(500).json({
            message: "Error deleting message",
            error: err.message
         });
    }
});

export default chatRouter;