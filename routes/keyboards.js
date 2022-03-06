const router = require("express").Router();
const keyboards = require("../models/keyboards.js");
const {verifyToken} = require("../validation")

// Crud operations
// /api/keyboards/
// Create keyboard entry  - post
router.post("/",verifyToken, (req, res) => {
  data = req.body;

  keyboards
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// /api/keyboards/
//Read all keyboard  - get

router.get("/", (req, res) => {
  keyboards
    .find()
    .then((data) => {
      res.send(mapArray(data));
    })

    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read instock keyboards  - get

router.get("/instock/:status", (req, res) => {
  keyboards
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

  keyboards
    .find({ price: filterExpr })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read specific keyboard  - get

router.get("/:id", (req, res) => {
  keyboards
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Update specific keyboard - put

router.put("/:id", (req, res) => {
  const id = req.params.id;

  keyboards
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
        res.send({ message: "Keyboard was succesfully updated." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating keyboard with id=" + id });
    });
});

//Delete specific keyboard - delete

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  keyboards
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message:
            "Cannot delete keyboard with id" +
            id +
            ".Maybe keyboard was not found!",
        });
      } else {
        res.send({ message: "Keyboard was succesfully deleted." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting keyboard with id=" + id });
    });
});

function mapArray(arr) {
  let outputArr = arr.map((element) => ({
    id: element._id,
    name: element.name,
    description: element.description,
    price: element.price,
    inStock: element.inStock,
    uri: `/api/keyboards/${element._id}`,
  }));

  return outputArr;
}

module.exports = router;
