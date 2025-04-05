import express from "express";
import {addLocation, deleteLocation, editLocation, fetchAllLocations, getSlots, handleImageUpload, ReleaseSlot} from "../../controllers/admin/admin-controller.js"
const router=express.Router();
import {upload}  from "../../helpers/cloudinary.js"

router.post('/upload-image',upload.single("imageFile"),handleImageUpload);
router.post('/addlocation',addLocation);
router.put('/edit/:location_id',editLocation);
router.put('/delete/:location_id',deleteLocation);
router.get('/getSlots/:location_id',getSlots);
router.get('/get',fetchAllLocations);
router.post('/releaseSlot',ReleaseSlot);



export default router;