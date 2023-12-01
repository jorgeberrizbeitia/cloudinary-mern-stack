# CLOUDINARY SETUP FOR MERN STACK

This code includes the basic setup for cloudinary in a MERN Stack App.
Code included is for both Server and Client side.

You can follow below Instructions below to add the functionality to your current code or see the code inside the repository server/client for an example of Create and Read of a document with an image property uploaded through cloudinary.

***

## Step 1. CLOUDINARY REGISTER

1. Create an account or log into [Cloudinary](https://cloudinary.com/)

2. In the Cloudinary Dashboard make sure you can see your three credential values: `Cloud Name`, `API Key` and `API Secret`. You will need all three later.

***

## Step 2. BACKEND CONFIG. Apply all below steps on your Server.

1. Install the 3 packages needed for the process.

```bash
npm i cloudinary multer multer-storage-cloudinary
```

2. Add a property of type STRING to the document Schema where you need the image. This will be the URL from cloudinary.

3. Create the middleware to upload images through cloudinary following below code.

```javascript
// middlewares/cloudinary.config.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png"],
    folder: "my-app", // The name of the folder where images will be stored in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  },
});

module.exports = multer({ storage });
```

4. Add the three credential values from your cloudinary dashboard to your `.env` file.

```.env
CLOUDINARY_NAME=value
CLOUDINARY_KEY=value
CLOUDINARY_SECRET=value
```

5. Create a specific route file that will handle any process for managing images in cloudinary. In this file you will create a post route that will:
  - Receive the image file from the Frontend.
  - Send it to cloudinary through the cloudinary middleware.
  - Receive the image URL from cloudinary as `req.file.path`.
  - Send the image URL to the Frontend for an image preview.

```javascript
// in routes/index.routes.js

// ...

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

// ...
```

```javascript
// in routes/upload.routes.js

const router = require("express").Router();

const uploader = require("../middlewares/cloudinary.config.js");

// POST "/api/upload"
router.post("/", uploader.single("image"), (req, res, next) => {
  // console.log("file is: ", req.file);

  if (!req.file) {
    // this will happend if cloudinary rejects the image for any reason
    res.status(400).json({
      errorMessage: "There was a problem uploading the image. Check image format and size."
    })
    return;
  }

  // get the URL of the uploaded file and send it as a response.
  // 'imageUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend (response.data.imageUrl)

  res.json({ imageUrl: req.file.path });
});

module.exports = router;
```

## Step 3. FRONTEND CONFIG. Apply all below steps on your Client.

2. Go to the component where you have a form that is creating or updating a new Document. Create below two states and the uploading function handler that is called when the button of the input type `file` is clicked.

```javascript
// add to component where you are creating an item

// below state will hold the image URL from cloudinary. This will come from the backend.
const [imageUrl, setImageUrl] = useState(null); 
const [isUploading, setIsUploading] = useState(false); // for a loading animation effect

// below function should be the only function invoked when the file type input changes => onChange={handleFileUpload}
const handleFileUpload = async (event) => {
  // console.log("The file to be uploaded is: ", e.target.files[0]);

  if (!event.target.files[0]) {
    // to prevent accidentally clicking the choose file button and not selecting a file
    return;
  }

  setIsUploading(true); // to start the loading animation

  const uploadData = new FormData(); // images and other files need to be sent to the backend in a FormData
  uploadData.append("image", event.target.files[0]);
  //                   |
  //     this name needs to match the name used in the middleware in the backend => uploader.single("image")

  try {
    const response = await axios.post("http://localhost:5005/api/upload", uploadData)
    // !IMPORTANT: Adapt the request structure to the one in your proyect (services, .env, auth, etc...)

    setImageUrl(response.data.imageUrl);
    //                          |
    //     this is how the backend sends the image to the frontend => res.json({ imageUrl: req.file.path });

    setIsUploading(false); // to stop the loading animation
  } catch (error) {
    navigate("/error");
  }
};
```

4. Then, in the same component, add the following input to allow the user to select an image, as well as a loading animation section and image preview.

```jsx
// ... in the JSX returned of the same component as above.

<div>
  <label>Image: </label>
  <input
    type="file"
    name="image"
    onChange={handleFileUpload}
    disabled={isUploading}
  />
  {/* below disabled prevents the user from attempting another upload while one is already happening */}
</div>;

{/* to render a loading message or spinner while uploading the picture */}
{isUploading ? <h3>... uploading image</h3> : null}

{/* below line will render a preview of the image from cloudinary */}
{imageUrl ? (<div><img src={imageUrl} alt="img" width={200} /></div>) : null;}
```

5. Continue with a regular flow of creating a Document.

- Use the other input fields and their values stored in states like title, description, etc.
- On the handleSubmit of the form use all info for creating/updating the document, including the imageUrl from the state.
- Use the service for creating/updating a Document with above values.

### Note: Once you are done with the steps and if you still have doubts, try checking the code in the repository for an example of the implementation.