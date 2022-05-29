const router = require("express").Router();

const withAuth = require("../utils/auth");
const multer  = require('multer')
const fs = require('fs');
const im  = require('imagemagick')
var path = require('path');
const pdfConverter =require('pdf-poppler');
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


function convertImage(pdfPath) {

  let option = {
      format : 'jpeg',
      out_dir : 'uploads\\img',
      out_prefix : path.basename(pdfPath, path.extname(pdfPath)),
      page : 1
  }
// option.out_dir value is the path where the image will be saved

pdfConverter.convert(pdfPath, option)
  .then(() => {
      console.log('file converted')
  })
  .catch(err => {
      console.log('an error has occurred in the pdf converter ' + err)
  })
return path.basename(pdfPath, path.extname(pdfPath));
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
  
    res.render("homepage");
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
    var img_name=await convertImage(path.join(req.file.destination,req.file.filename));
    img_name=img_name+'-1.jpg';
      
    const fileData = await Files.create({
      title:req.body.title,
      brief_description:req.body.brief_description,
      user_id: req.session.user_id,
      price:req.body.price,
      cover_art:img_name,
      type_id:req.body.type_id,
      category_id:req.body.category_id,
      source_file:req.file.filename,
user_id:1
    });
   // console.log(req.file, req.body,req.file.filename,img_name)
  console.log(fileData);
    res.redirect("/");
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
