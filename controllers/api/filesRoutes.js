const router = require("express").Router();
const { Files } = require("../../models");

//Add new Files method
router.post("/", async (req, res) => {
  try {
    const fileData = await Files.create({
      title: req.body.title,
      brief_description: req.body.brief_description,
      user_id: req.session.user_id,
      price: req.body.price,
      cover_art: req.body.cover_art,
      type_id: req.body.type_id,
      category_id: req.body.category_id,
    });

    res.status(200).json(fileData);
  } catch (err) {
    res.status(400).json(err);
  }
});
//Update file method
router.put("/", async (req, res) => {
  try {
    const fileData = await Files.update(
      {
        title: req.body.title,
        brief_description: req.body.brief_description,
        user_id: req.session.user_id,
        price: req.body.price,
        cover_art: req.body.cover_art,
        type_id: req.body.type_id,
        category_id: req.body.category_id,
      },
      {
        // Gets a blog based on the id given in the body
        where: {
          id: req.body.id,
        },
      }
    );

    res.status(200).json(fileData);
  } catch (err) {
    res.status(400).json(err);
  }
});
//delete file method
router.delete("/:id", async (req, res) => {
  try {
    const fileData = await Files.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(fileData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
