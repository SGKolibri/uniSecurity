const express = require('express');
const router = express.Router();

const utilsController = require('../controller/utilsController');

router.post("/send-email-by-id/:id", utilsController.sendEmailByID);
router.post("/pdf", utilsController.generatePDF);

module.exports = router;