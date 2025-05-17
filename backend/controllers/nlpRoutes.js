const express = require("express");
const { summarizeText } = require("../controllers/nlpController");
const router = express.Router();

router.post("/summarize", summarizeText);

module.exports = router;