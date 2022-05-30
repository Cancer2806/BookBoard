const router = require('express').Router();
const { Reviews } = require('../../models');

//Add new Reviews method
router.post('/', async (req, res) => {
    try {
      
      const reviewData = await Reviews.create({
        review_content:req.body.review_content,
        rating:req.body.rating,
        user_id: 1,
        file_id:req.body.file_id,
      });
  
      res.status(200).json(reviewData);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  //Update review method
router.put('/', async (req, res) => {
  try {
    
    const reviewData = await Reviews.update({
      review_content:req.body.review_content,
      rating:req.body.rating
    },
    {
      // Gets a blog based on the id given in the body
      where: {
        id: req.body.id,
      },
    });

    res.status(200).json(reviewData);
  } catch (err) {
    res.status(400).json(err);
  }
});
//delete review method
router.delete("/:id", async (req, res) => {
  try {
    const reviewData = await Reviews.destroy({where: {
      id: req.params.id,
    }});

    res.status(200).json(reviewData);
  } catch (err) {
    res.status(400).json(err);
  }
});

  module.exports = router;
