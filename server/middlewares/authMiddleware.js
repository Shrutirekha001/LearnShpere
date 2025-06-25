import { clerkClient } from "@clerk/express";

// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) =>{
    try {
        const userId = req.auth.userId;
        const respone = await clerkClient.users.getUser(userId);

        if(respone.publicMetadata.role !== 'educator'){
            return res.json({success: false, message: 'Unauthorized Access, You are not an Educator'})
        }
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}