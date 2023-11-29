const multer = require("multer");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const imageModel = require("../models/image.model");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Creating Storage
  const Storage = multer.diskStorage({
    destination: "uploads", // Folder name where images will be stored
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  // To upload image
  const upload = multer({
    storage: Storage,
  }).single("testImage");

  // To post image in database
  app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        const newImage = new imageModel({
          userId: req.body.userId,
          location: {
            lat: req.body.lat,
            log: req.body.log,
          },
          image: {
            data: req.file.filename,
            contentType: "image/png",
          },
          caption: req.body.caption,
        });
        newImage
          .save()
          .then(() => res.send("Succesfully Uploaded"))
          .catch((err) => console.log(err));
      }
    });
  });

  // Get imagedata through image id
  // app.get('/upload/:id', (req, res) => {
  //   const imageId = req.params.id;

  // //  Find the image in the database by its ID
  //   imageModel.findById(imageId, (err, image) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).send('Internal Server Error');
  //     } else if (!image) {
  //       res.status(404).send('Image not found');
  //     } else {
  //       // Send the image and its related data as a response
  //       res.json({
  //         location: {
  //           lat: image.location.lat,
  //           log: image.location.log,
  //         },
  //         image: {
  //           data: image.image.data,
  //           contentType: image.image.contentType,
  //         },
  //         caption: image.caption,
  //       });
  //     }
  //   });
  // });

  // Get userdata through userId
  app.get("/upload/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;

      // Find the user based on userId and perform a join with the imageModel collection
      const userData = await imageModel.aggregate([
        {
          $match: { userId: mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "users", // The name of the users collection
            localField: "userId", // The field in the images collection
            foreignField: "_id", // The field in the users collection
            as: "user",
          },
        },
      ]);

      // Check if user with the specified userId exists
      if (userData.length === 0) {
        return res
          .status(404)
          .json({ message: "User has not posted anything yet" });
      }

      res.json({
        userData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get all userData
  app.get("/upload", async (req, res) => {
    try {
      // Find all users and their associated images using $lookup
      const allUserData = await imageModel.aggregate([
        {
          $lookup: {
            from: "users", // The name of the users collection
            localField: "userId", // The field in the images collection
            foreignField: "_id", // The field in the users collection
            as: "user",
          },
        },
      ]);

      // Check if there is any user data
      if (allUserData.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      res.json({
        allUserData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
};
