import { useState, useEffect } from "react";
import axios from "axios";

const LocationImageUpload = ({ imageFile, setImageFile, uploadedImageUrl, setUploadedImageUrl, setImageLoadingState, isLoadingState }) => {
  const [dragging, setDragging] = useState(false);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Function to handle drag over event
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  // Function to handle drag leave event
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Function to handle drop event
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Function to upload image to server
  const uploadImageToServer = async () => {
    if (!imageFile) return;

    setImageLoadingState(true);
    
    const data = new FormData();
    data.append("imageFile", imageFile);

    try {
      const response = await axios.post("http://localhost:5000/admin/upload-image", data);

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      } else {
        console.error("Upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setImageLoadingState(false);
    }
  };

  console.log(uploadedImageUrl, "uploadedImageUrl");

  // Upload image whenever imageFile changes
  useEffect(() => {
    if (!imageFile) return;

    const upload = async () => {
      await uploadImageToServer();
    };

    upload();
  }, [imageFile]);

  return (
    <div>
      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
          dragging ? "border-blue-500 bg-gray-100" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" onChange={handleFileChange} className="hidden" id="imageUpload" />
        <label htmlFor="imageUpload" className="cursor-pointer">
          {imageFile ? (
            <p className="text-green-600 font-semibold">✅ File Selected: {imageFile.name}</p>
          ) : (
            <p className="text-gray-500">📂 Drag & drop an image here or click to upload</p>
          )}
        </label>
      </div>

      {/* Image Preview */}
      {uploadedImageUrl && (
        <div className="mt-4">
          <p className="text-white font-semibold">🖼 Uploaded Image:</p>
          <img src={uploadedImageUrl} alt="Uploaded" className="w-32 h-32 mt-2 object-cover rounded-lg shadow-md" />
        </div>
      )}

      {/* Loading State */}
      {isLoadingState && <p className="text-yellow-500 font-semibold mt-2">⏳ Uploading...</p>}
    </div>
  );
};

export default LocationImageUpload;
