const router = require("express").Router();

const withAuth = require("../utils/auth");
const multer = require("multer");
const fs = require("fs");
const im = require("imagemagick");
var path = require("path");
const pdfConverter = require("pdf-poppler");
const { Categories, Types, Files, Users, Reviews, Downloads } = require("../models");
const { sync } = require("../models/Users");
const path_img = "public/uploads/img/";
const path_pdf = "public/uploads/doc/";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path_pdf);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

var upload = multer({ storage: storage });

function convertImage(pdfPath) {
  let option = {
    format: "jpeg",
    out_dir: "public\\uploads\\img",
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: 1,
  };
  // option.out_dir value is the path where the image will be saved

  pdfConverter
    .convert(pdfPath, option)
    .then(() => {
      console.log("file converted");
    })
    .catch((err) => {
      console.log("an error has occurred in the pdf converter " + err);
    });
  return path.basename(pdfPath, path.extname(pdfPath));
}

const getDocumentCategory = async () => {
  const data1 = await Categories.findAll();
  const category = data1.map((data) => data.get({ plain: true }));
  return category;
};

const getDocumentType = async () => {
  const data2 = await Types.findAll();
  const doc_type = data2.map((data) => data.get({ plain: true }));

  return doc_type;
};

router.get("/", async (req, res) => {
  try {
    const docs = await Files.findAll({
      limit: 8,
      order: [["id", "DESC"]],
    });

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

    // Serialize data so the template can read it
    const recomendedDoc = docs.map((doc) => doc.get({ plain: true }));
    const popularDoc = docs1.map((doc) => doc.get({ plain: true }));

    res.render("homepage", {
      recomendedDoc,
      popularDoc,
      latestdoc: popularDoc,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/upload", async (req, res) => {
  try {
    const doc_type = await getDocumentType();
    const category = await getDocumentCategory();
    res.render("addFiles", { category, doc_type });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/addreview/:id", async (req, res) => {
  try {
   res.render("addReview",{id:req.params.id});
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/upload", upload.single("source_file"), async (req, res, next) => {
  try {
    var img_name = await convertImage(
      path.join(req.file.destination, req.file.filename)
    );
    img_name = img_name + "-1.jpg";

    const fileData = await Files.create({
      title: req.body.title,
      brief_description: req.body.brief_description,
      user_id: req.session.user_id,
      price: req.body.price,
      cover_art: img_name,
      type_id: req.body.type_id,
      category_id: req.body.category_id,
      source_file: req.file.filename,
      user_id: 1,
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

router.get("/profile/:id", async (req, res) => {
  try {
    const userData = await Users.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{all: true, nested: true}],
    });
    
    const user = userData.get({plain: true});
    
    res.render("profile", {user});
    // res.json(user)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get("/register", async (req, res) => {
  try {
    res.render("signUp");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search", async (req, res) => {
  try {
    const doc_type = await getDocumentType();
    const category = await getDocumentCategory();
    // console.log(req.query)

    const searchQuery = await Files.findAll({
      include: [        
      {
        model: Users,
        attributes: ["first_name", "last_name"],
      },]
    })
    const userSearch = searchQuery.map((search) => search.get({plain: true}));
    // console.log(userSearch[8].author)
    // console.log(req.query.author)
    let result = [];
    let result2 = [];
    let result3 = [];
    let result4 = [];
    let result5 = [];
    let result6 = [];
    
    if (req.query.title) {
      result = userSearch.filter(query => query.title == req.query.title)
    } else {
      result = userSearch
    }
    // console.log(result)
    if (req.query.author) {
      result2 = result.filter(query => req.query.author  == `${query.user.first_name} ${query.user.last_name}`) 
    } else {
      result2 = result;
    }
    console.log("\n__________________________\n")
    console.log(result2)
    console.log("\n__________________________\n")
    if (req.query.genre) {
      result3 = result2.filter((query) => {
        // query.category_id === req.query.genre
        return req.query.genre.some((f) => {
          // console.log(f)
          // console.log("\n__________________________\n")
          // console.log(query.category_id)
          return f == query.category_id
        })
      }) 
    } else {
      result3 = result2
    }
    // console.log(result3)
    if (req.query.category) {
      result4 = result3.filter((query) => {
        return req.query.category.some((f) => {
          return f == query.type_id
        })
      }) 
    } else {
      result4 = result3
    }
    if (req.query.free == "on") {
      result5 = result4.filter(query => query.price == "0.00") 
    } else {
      result5 = result4;
    }
    if (req.query.descending == "on") {
      result6 = result5.reverse()
    } else {
      result6 = result5;
    }
    // console.log(result)
    let search_query = result6


    // {
    //   title: 'book-title',
    //   author: 'authorname',
    //   genre: [ '1', '2', '3', '4' ],
    //   category: [ '1', '2', '3' ],
    //   free: 'on',
    //   descending: 'on'
    // }

    res.render("search", { category, doc_type, search_query });
    // res.json(search_query)
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/file/:id", async (req, res) => {
  try {

    const data = await Files.findByPk(req.params.id, {
      include: [
        {
          model: Users,
          attributes: ["first_name","last_name"],
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
          attributes: ["review_content","rating"],
          include:[{model:Users,attributes: ["first_name","last_name"]}]
        },
        {
          model: Downloads,
          attributes: ["price","id"],
          include:[{model:Users,attributes: ["first_name","last_name"]}]
        },
      ],
    });
    const fileobj = data.get({ plain: true });
    res.render("file",fileobj);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
