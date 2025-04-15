import express from "express";
import {addLocation, deleteLocation, editLocation, fetchAllLocations, fetchLocation, getAdminUser, getAllBookings, getDetails, getSlots, getUsersOverview, handleImageUpload, ReleaseSlot,reserveSlot,unreserveSlot} from "../../controllers/admin/admin-controller.js"
const router=express.Router();

import {upload}  from "../../helpers/cloudinary.js"
import {authMiddleware} from "../../controllers/auth/auth-controller.js"

router.post('/upload-image',upload.single("imageFile"),handleImageUpload);
router.post('/addlocation',addLocation);
router.put('/edit/:id',editLocation);
router.post('/location/delete',deleteLocation);
router.get('/location/:id',fetchLocation);
router.get('/getSlots/:location_id',getSlots);
router.get('/get',fetchAllLocations);
router.post('/releaseSlot',ReleaseSlot);

router.post('/reserveSlot',authMiddleware,reserveSlot);
router.post('/unreserveSlot',authMiddleware,unreserveSlot);
router.post('/getDetails',getDetails);



router.get('/users/overview', getUsersOverview);
router.get('/bookings',getAllBookings);
router.get('/users/:userId',getAdminUser);

export default router;