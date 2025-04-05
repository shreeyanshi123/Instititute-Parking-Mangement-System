const express=require("express");
const {handleImageUpload,addLocation}=require("../../controllers/admin/admin-controller");
const {upload}=require("../../helpers/cloudinary");

const router=express.Router();

router.post('/upload-image',upload.single("my_file"),handleImageUpload);
router.post('/add',addLocation);

module.exports=router;
