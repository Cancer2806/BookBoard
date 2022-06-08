const router = require("express").Router();
const sequelize = require("../config/connection");
const withAuth = require("../utils/auth");
const multer = require("multer");
const { promises: fs } = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
//const im = require("imagemagick");
var path = require("path");
const {
  Categories,
  Types,
  Files,
  Users,
  Reviews,
  Downloads,
} = require("../models");

const path_temp = "public/uploads/temp/";
const path_pdf = "public/uploads/doc/";
const path_img = "public/uploads/img/";


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path_pdf);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

var upload = multer({ storage: storage });

//pdf poppler naming pattern
var convertName = (imgname, noOfPages, page) => {
  if (noOfPages < 10) {
    return imgname + "-" + page + ".jpg";
  } else if (noOfPages < 100) {
    return imgname + "-0" + page + ".jpg";
  } else {
    return imgname + "-00" + page + ".jpg";
  }
};

//converting pdf pages to jpg image
const convertImage = async (pdfPath, imgpath, page, numPages) => {
  img_name = path.basename(pdfPath, path.extname(pdfPath));

  let option = {
    format: "jpeg",
    out_dir: imgpath,
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: page,
  };

  // await pdfConverter
  //   .convert(pdfPath, option)
  //   .then((res) => {
      
  //     console.log("file converted");
  //   })
  //   .catch((err) => {
  //     console.log("an error has occurred in the pdf converter " + err);
  //   });

  img_name = convertName(img_name, numPages, page);

  return img_name;
};

var resultHandler = function (err) {
  if (err) {
    console.log("unlink failed", err);
  } else {
    console.log("file deleted");
  }
};

//preview image loading
const loadTempPdfImages = async (source_file) => {
  var img_list = [];
  try {
    const files = await fs.readdir(path_temp);
    if (files) {
      const unlinkPromises = await files.map((filename) =>
        fs.unlink(`${path_temp}/${filename}`, resultHandler)
      );
      await Promise.all(unlinkPromises);
    }
    let numPages = 0;
    await pdfjsLib
      .getDocument(path.join(path_pdf, source_file))
      .promise.then(function (doc) {
        numPages = doc.numPages;
        console.log("# Document Loaded");
        console.log("Number of Pages: " + numPages);
      })
      .catch((err) => {
        console.log("an error has occurred in the pdf converter " + err);
      });
    for (let i = 1; i < 5; i++) {
      let file = await convertImage(
        path.join(path_pdf, source_file),
        path_temp,
        i,
        numPages
      );

      img_list.push(file);
    }
  } catch (err) {
    console.log(err);
  }
  return img_list;
};

//get document category method
const getDocumentCategory = async () => {
  const data1 = await Categories.findAll();
  const category = data1.map((data) => data.get({ plain: true }));
  return category;
};

//get document type method
const getDocumentType = async () => {
  const data2 = await Types.findAll();
  const doc_type = data2.map((data) => data.get({ plain: true }));

  return doc_type;
};

//landing page route
router.get("/", async (req, res) => {
  try {

    //Loading random collection
    const docs = await Files.findAll({
      limit: 8,
      order: [[sequelize.literal("RAND()")]],
    });

      //loading latest 4 in recently added files
    const docs1 = await Files.findAll({
      limit: 4,
      order: [["id", "DESC"]],
      include: [
        {
          model: Users,
          attributes: ["first_name", "last_name"],
        },
        {
          model: Categories,
          attributes: ["category_name"],
        },
        {
          model: Types,
          attributes: ["type_name"],
        },
      ],
    });

    //most downloadded once under popular
    const docs2 = await Downloads.findAll({
      limit: 4,
      group: ["file_id"],
      order: [[sequelize.col("CountedValue"), "DESC"]],
      attributes: [[sequelize.fn("COUNT", "1"), "CountedValue"], "file_id"],
      include: [
        {
          model: Files,
          attributes: [
            "id",
            "title",
            "brief_description",
            "price",
            "source_file",
            "cover_art",
            "user_id",
          ],
          include: [
            {
              model: Users,
              attributes: ["first_name", "last_name"],
            },
            {
              model: Categories,
              attributes: ["category_name"],
            },
            {
              model: Types,
              attributes: ["type_name"],
            },
          ],
        },
      ],
    });

    // Serialize data so the template can read it
    const randomDoc = docs.map((doc) => doc.get({ plain: true }));
    const latestdoc = docs1.map((doc) => doc.get({ plain: true }));
    const popularDoc = docs2.map((doc) => doc.get({ plain: true }));

    res.render("homepage", {
      randomDoc,
      popularDoc,
      latestdoc,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//upload route call
router.get("/upload", withAuth, async (req, res) => {
  try {
    const doc_type = await getDocumentType();
    const category = await getDocumentCategory();
    res.render("addFiles", {
      category,
      doc_type,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//add review route
router.get("/addreview/:id", async (req, res) => {
  try {
    res.render("addReview", {
      id: req.params.id,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//upload post method
router.post("/upload", upload.single("source_file"), async (req, res, next) => {
  try {
    let numPages = 0;
    await pdfjsLib
      .getDocument(path.join(req.file.destination, req.file.filename))
      .promise.then(function (doc) {
        numPages = doc.numPages;
        console.log("# Document Loaded");
        console.log("Number of Pages: " + numPages);
      })
      .catch((err) => {
        console.log("an error has occurred in the pdf converter " + err);
      });
    var img_name = await convertImage(
      path.join(req.file.destination, req.file.filename),
      path_img,
      1,
      numPages
    );

    const fileData = await Files.create({
      title: req.body.title,
      brief_description: req.body.brief_description,
      user_id: req.session.user_id,
      price: req.body.price,
      cover_art: img_name,
      type_id: req.body.type_id,
      category_id: req.body.category_id,
      source_file: req.file.filename,
    });
    // console.log(req.file, req.body,req.file.filename,img_name)
    console.log(fileData);
    res.redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
});

//login page route
router.get("/login", async (req, res) => {
  try {
    res.render("userLogin", {
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//profile page load
router.get("/profile/:id", withAuth, async (req, res) => {
  try {
    const userData = await Users.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [{ all: true, nested: true }],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      user,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
    // res.json(user)
  } catch (err) {
    res.status(500).json(err);
  }
});

//register page load
router.get("/register", async (req, res) => {
  try {
    res.render("signUp", {
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//search page route
router.get("/search", async (req, res) => {
  try {
    const doc_type = await getDocumentType();
    const category = await getDocumentCategory();

    const searchQuery = await Files.findAll({
      include: [
        {
          model: Users,
          attributes: ["first_name", "last_name"],
        },
      ],
    });
    const userSearch = searchQuery.map((search) => search.get({ plain: true }));
    let result = [];
    let result2 = [];
    let result3 = [];
    let result4 = [];
    let result5 = [];
    let result6 = [];

    //filtering based on title
    if (req.query.title) {
      result = userSearch.filter((query) => query.title == req.query.title);
    } else {
      result = userSearch;
    }
    
    //filtering based on author
    if (req.query.author) {
      result2 = result.filter(
        (query) =>
          req.query.author == `${query.user.first_name} ${query.user.last_name}`
      );
    } else {
      result2 = result;
    }
   //filtering based on genre
    if (req.query.genre) {
      result3 = result2.filter((query) => {
        if (Array.isArray(req.query.genre)) {
         return req.query.genre.some((f) => {
            return f == query.type_id;
          });
        } else {
          return req.query.genre == query.type_id;
        }
      });
    } else {
      result3 = result2;
    }
    //filtering based on category
    if (req.query.category) {
      result4 = result3.filter((query) => {
        if (Array.isArray(req.query.category)) {
          return req.query.category.some((f) => {
            return f == query.category_id;
          });
        } else {
          return req.query.category == query.category_id;
        }
      });
    } else {
      result4 = result3;
    }
    if (req.query.free == "on") {
      result5 = result4.filter((query) => query.price == "0.00");
    } else {
      result5 = result4;
    }
    if (req.query.descending == "on") {
      result6 = result5.reverse();
    } else {
      result6 = result5;
    }
   
    let search_query = result6;

   

    res.render("search", {
      category,
      doc_type,
      search_query,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
   
  } catch (err) {
    res.status(500).json(err);
  }
});

//load file route
router.get("/file/:id", async (req, res) => {
  try {
    const data = await Files.findByPk(req.params.id, {
      include: [
        {
          model: Users,
          attributes: ["first_name", "last_name"],
        },
        {
          model: Categories,
          attributes: ["category_name"],
        },
        {
          model: Types,
          attributes: ["type_name"],
        },
        {
          model: Reviews,
          attributes: ["review_content", "rating"],
          include: [{ model: Users, attributes: ["first_name", "last_name"] }],
        },
        {
          model: Downloads,
          attributes: ["price", "id"],
          include: [{ model: Users, attributes: ["first_name", "last_name"] }],
        },
      ],
    });
    const fileobj = data.get({ plain: true });
    const preview_img = await loadTempPdfImages(fileobj.source_file);
    res.render("file", {
      fileobj,
      preview_img,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/logout", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
});
module.exports = router;
