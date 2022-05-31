const router = require("express").Router();
const mousepads = require("../models/mousepads.js");
const {verifyToken} = require("../validation");
const NodeCache = require("node-cache");
//stdTTL is the time to live in seconds
const cache = new NodeCache ({stdTTL:600});

// Crud operations
// /api/mousepads/
// Create mousepad entry  - post
//router.post("/",verifyToken, (req, res) => {
  router.post("/", (req, res) => {
  data = req.body;

  mousepads
    .insertMany(data)
    .then((data) => {
      cache.flushAll();
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// /api/mousepads/
//Read all mousepads  - get

router.get("/",async (req, res) => {

  try{
    //try to get data from the cache
    let mousepadsCache = cache.get("allMousepads");
    //if data is not in the cache, get it from the database
    if(!mousepadsCache){
      let data = await mousepads.find();

      console.log("No cache data found. Fetching from DB..")
      const timeToLiveSecs=30;
      cache.set('allMousepads',data);

      res.send(mapArray(data));
    } 
    else{
      console.log("Cache data found. Returning from cache..")
      res.send( mapArray(mousepadsCache));
    }
  }
  catch(err){
    res.status(500).send({ message: err.message });
  }

  }
/*   mousepads
    .find()
    .then((data) => {
      res.send(mapArray(data));
    })

    .catch((err) => {
      res.status(500).send({ message: err.message });
    }); */
);

//Read instock mousepads  - get

router.get("/instock/:status", (req, res) => {
  mousepads
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

  mousepads
    .find({ price: filterExpr })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read specific mousepads  - get

router.get("/:id", (req, res) => {
  mousepads
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Update specific mousepad - put

router.put("/:id", (req, res) => {
  const id = req.params.id;

  mousepads
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
        res.send({ message: "Mousepad was succesfully updated." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating mousepad with id=" + id });
    });
});

//Delete specific mousepad - delete

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  mousepads
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot delete mousepad with id" +
            id +
            ".Maybe mousepad was not found!",
        });
      } else {
        res.send({ message: "Mousepad was succesfully deleted." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting mousepad with id=" + id });
    });
});

function mapArray(arr) {
  let outputArr = arr.map((element) => ({
    id: element._id,
    name: element.name,
    description: element.description,
    price: element.price,
    inStock: element.inStock,
    uri: `/api/mousepads/${element._id}`,
  }));

  return outputArr;
}

module.exports = router;
