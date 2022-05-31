const router = require('express').Router();
const { Downloads } = require('../../models');

//Add new downloads method
router.post('/', async (req, res) => {
    try {
      const data=await Downloads.findOne({where:{file_id:req.body.file_id,user_id:1}});
      if(!data)
      { const downloadData = await Downloads.create({
        price:req.body.price,
        user_id: 1,
        file_id:req.body.file_id,
      
      });
      res.status(200).json(downloadData);
      }
     
  
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json(err);
    }
  });
 
//delete download method
router.delete("/:id", async (req, res) => {
  try {
    const Data = await Downloads.destroy({where: {
      id: req.params.id,
    }});

    res.status(200).json(Data);
  } catch (err) {
    res.status(400).json(err);
  }
});

  module.exports = router;
