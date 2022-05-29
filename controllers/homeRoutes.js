const router = require("express").Router();

const withAuth = require("../utils/auth");
const multer  = require('multer')
const fs = require('fs');
const im  = require('imagemagick')
var path = require('path');

const { Categories, Types, Files } = require("../models");
const { sync } = require("../models/Users");
const path_img = 'uploads/img/';
const path_pdf = 'uploads/doc/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path_pdf)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});
var upload = multer({ storage: storage });

var save_document_image=async(filename)=>{
try{
  let path = '/tmp/';
  let img_name=Date.now() + '.jpg';
  let filePath =  path_pdf + filename;
  let imgFilePath = path_img +img_name;
  let writeStream =await fs.createWriteStream(imgFilePath);
  let stream=await fs.createReadStream(filePath);
  writeStream.on('error',err => {
    reject(err);
  });
  stream.pipe(writeStream);


    im.convert([
      filePath ,
      '-background','white',
      '-alpha','remove',
      '-resize','192x192',
      '-quality','100',
      imgFilePath
    ]);
    return img_name;
}
catch(err)
{
  return null;
}
 
}

const getDocumentCategory=async ()=>
{
  const data1=await Categories.findAll();
  const category = data1.map((data) => data.get({ plain: true }));
 return category;
}

const getDocumentType=async ()=>
{
  const data2=await Types.findAll();
  const doc_type =data2.map((data) => data.get({ plain: true }));
 
 return doc_type;
}

router.get("/", async (req, res) => {
  try {

    const doc_type=await getDocumentType();
    const category=await getDocumentCategory();
    res.render("addFiles",{category,doc_type});
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/upload", async (req, res) => {
  try {
    const doc_type=await getDocumentType();
    const category=await getDocumentCategory();
    res.render("addFiles",{category,doc_type});
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/upload", upload.single('source_file'),async (req, res,next) => {
  try {
    var img_name=await save_document_image(req.file.filename);
    console.log(req.file, req.body,req.file.filename,img_name)
    const doc_type=await getDocumentType();
    const category=await getDocumentCategory();
    res.render("addFiles",{category,doc_type});
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/login", async (req, res) => {
  try {
    res.render("userLogin");
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/register", async (req, res) => {
  try {
    res.render("signUp");
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
