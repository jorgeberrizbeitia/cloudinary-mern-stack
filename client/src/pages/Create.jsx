import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Create() {
  const navigate = useNavigate();

  const [name, setName] = useState(""); // this will hold the name string as usual
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // this will hold the image URL from cloudinary. This will come from the backend

  const handleNameChange = (event) => {
    // this function updates the state that defines the value of the input. Process as usual
    setName(event.target.value);
  };

  const handleFileUpload = async (event) => {
    // console.log("The file to be uploaded is: ", e.target.files[0]);

    if (!event.target.files[0]) {
      // to prevent accidentally clicking the choose file button
      return;
    }

    setIsUploading(true); // to start the loading animation

    const uploadData = new FormData(); // images and other files need to be sent to the backend in a FormData
    uploadData.append("image", event.target.files[0]);
    //                   |
    //     this name needs to match the name used in the middleware => uploader.single("image")

    try {
      const response = await axios.post("http://localhost:5005/api/upload", uploadData)
      // !IMPORTANT: Adapt the request structure to the one in your project (services, .env, auth, etc...)

      setImageUrl(response.data.imageUrl);
      //                          |
      //     this is how the backend sends the image in the frontend => res.json({ imageUrl: req.file.path });

      setIsUploading(false); // to stop the loading animation
    } catch (error) {
      navigate("/error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newItem = {
      name: name,
      image: imageUrl, // this should be the URL from cloudinary that we send to the backend
    };

    try {

      await axios.post("http://localhost:5005/api/item", newItem)
      // !IMPORTANT: Adapt the request structure to the one in your project (services, .env, auth, etc...)

      navigate("/item/list")

    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <div>
      <h1>Form to Add Items</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input type="text" name="name" onChange={handleNameChange} />
        </div>

        <div>
          <label>Image: </label>
          <input
            type="file"
            name="image"
            onChange={handleFileUpload}
            disabled={isUploading}
            />
          {/* above disabled prevents the user to attempt another upload while one is already happening */}
        </div>

        {/* to render a loading message or spinner while uploading the picture */}
        {isUploading ? <h3>... uploading image</h3> : null}

        {/* below line will render a preview of the image from cloudinary */}
        {imageUrl ? (<div><img src={imageUrl} alt="img" width={200} /></div>) : null}

        <button disabled={isUploading}>Add</button>
      </form>
    </div>
  );
}

export default Create;
