const router = require("express").Router();
const headphones = require("../models/headphones.js");
const {verifyToken} = require("../validation");
const NodeCache = require("node-cache");
//stdTTL is the time to live in seconds
const cache = new NodeCache ({stdTTL:600});

// Crud operations
// /api/headphones/
// Create headphone entry  - post
//router.post("/",verifyToken, (req, res) => {
  router.post("/", (req, res) => {
  data = req.body;

  headphones
    .insertMany(data)
    .then((data) => {
      cache.flushAll();
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// /api/headphones/
//Read all headphones  - get

router.get("/",async (req, res) => {

  try{
    //try to get data from the cache
    let headphonesCache = cache.get("allHeadphones");
    //if data is not in the cache, get it from the database
    if(!headphonesCache){
      let data = await headphones.find();

      console.log("No cache data found. Fetching from DB..")
      const timeToLiveSecs=30;
      cache.set('allHeadphones',data);

      res.send(mapArray(data));
    } 
    else{
      console.log("Cache data found. Returning from cache..")
      res.send( mapArray(headphonesCache));
    }
  }
  catch(err){
    res.status(500).send({ message: err.message });
  }

  }
/*   headphones
    .find()
    .then((data) => {
      res.send(mapArray(data));
    })

    .catch((err) => {
      res.status(500).send({ message: err.message });
    }); */
);

//Read instock headphones  - get

router.get("/instock/:status", (req, res) => {
    headphones
    .find({ inStock: req.params.status })
    .then((data) => {
      res.send(mapArray(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Price route
router.get("/price/:operator/:price", (req, res) => {
  const operator = req.params.operator;
  const price = req.params.price;

  let filterExpr = {};
  if (operator == "gt") filterExpr = { $gte: req.params.price };
  else if (operator == "lt") filterExpr = { $lte: req.params.price };
  else filterExpr = $lte.req.params.price;

  headphones
    .find({ price: filterExpr })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read specific headphones  - get

router.get("/:id", (req, res) => {
    headphones
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Update specific headphone - put

router.put("/:id", (req, res) => {
  const id = req.params.id;

  headphones
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot update keyboard with id" +
            id +
            ".Maybe keyboard was not found!",
        });
      } else {
        res.send({ message: "headphone was succesfully updated." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating headphone with id=" + id });
    });
});

//Delete specific headphone - delete

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  headphones
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot delete headphone with id" +
            id +
            ".Maybe headphone was not found!",
        });
      } else {
        res.send({ message: "headphone was succesfully deleted." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting headphone with id=" + id });
    });
});

function mapArray(arr) {
  let outputArr = arr.map((element) => ({
    id: element._id,
    name: element.name,
    description: element.description,
    price: element.price,
    inStock: element.inStock,
    uri: `/api/headphones/${element._id}`,
  }));

  return outputArr;
}

module.exports = router;
