import express from "express";
import {addLocation, deleteLocation, editLocation, fetchAllLocations, getSlots, handleImageUpload, ReleaseSlot,reserveSlot,unreserveSlot} from "../../controllers/admin/admin-controller.js"
const router=express.Router();
import {upload}  from "../../helpers/cloudinary.js"

router.post('/upload-image',upload.single("imageFile"),handleImageUpload);
router.post('/addlocation',addLocation);
router.put('/edit/:location_id',editLocation);
router.post('/location/delete',deleteLocation);
router.get('/getSlots/:location_id',getSlots);
router.get('/get',fetchAllLocations);
router.post('/releaseSlot',ReleaseSlot);
router.post('/reserveSlot',reserveSlot);
router.post('/unreserveSlot',unreserveSlot);



export default router;