const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
    cloud_name: "dm2ebgi37",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary