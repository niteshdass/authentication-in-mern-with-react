const express = require("express");
const router = express.Router();

const {
  create, list, update
} = require("../controllers/post");
const { userSignupValidator } = require("../validator");

router.post("/create/post", create);
router.put("/update", update);
router.get("/post", list);

module.exports = router;