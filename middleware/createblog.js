const util = require("util");
const multer = require("multer");
var fs = require('fs');

const DIR = './public/uploads/posts';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //let username=req.query.username;
        //let username=maradisu;

        if (!fs.existsSync(DIR)){
            fs.mkdirSync(DIR);
        }
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        //let username=req.query.username;
        let username=maradisu;
        let uuid='12134ewwge14';
        const blogid = uuid+'_'+username;
       // fileName =file.originalname+username;
        cb(null, blogid)
    },
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf" || file.mimetype == "text/markdown") {
            cb(null, true);
        } 
        else {
            cb(null, false);
            return cb(new Error('Only images and pdfs are allowed!'));
        }
        if (file.originalname.length>=20) {
            cb(null, false);
            return cb(new Error('filename should be less than 20 characters !'));
        }
    }
}).single("file");

let fileUploadMiddleware = util.promisify(upload);

module.exports = fileUploadMiddleware;
