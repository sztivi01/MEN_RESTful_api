const router = require("express").Router();
const keyboards = require("../models/keyboards.js");


// Crud operations
// /api/keyboards/
// Create keyboard entry  - post
router.post("/", (req, res) => {
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
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Read instock keyboards  - get

router.get("/instock", (req, res) => {
  keyboards
    .find({ inStock: true })
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

module.exports = router;
