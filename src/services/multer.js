const multer = require("multer")

const fileValidation = {
    image: ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg"],
}

const HME = (err, req, res, next) => {
    if (err) {
        res.status(400).json({ message: "Multer error", err })
    } else {
        next()
    }
}

function myMulter(customValidation = fileValidation.image) {
    const storage = multer.diskStorage({})

    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb("invalid format", false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}

module.exports = { myMulter, HME ,fileValidation}