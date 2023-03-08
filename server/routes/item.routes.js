const router = require("express").Router();

const Item = require("../models/Item.model");

// GET "/api/item" => To send all items with their images
router.get("/", async (req, res, next) => {
  try {
    const response = await Item.find()
    res.json(response)
  } catch(err) {
    next(err)
  }
})

// POST "/api/item" => To create a new Item with name and image
router.post("/", async (req, res, next) => {
  // image URL from cloudinary is received from Frontend
  const { name, image } = req.body;
  try {
    const response = await Item.create({
      name: name,
      image: image
    })
    res.json(response)
  } catch(err) {
    next(err)
  }
})

module.exports = router;
