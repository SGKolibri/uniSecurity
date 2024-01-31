const express = require("express");
const router = express.Router();

const ocorrenciaController = require('../controller/ocorrenciaController');

router.post("/reg-ocorrencia", ocorrenciaController.registerOcorrencia);

router.get("/get-ocorrencia", ocorrenciaController.getOcorrencia);

router.get("/get-total-ocorrencias", ocorrenciaController.getTotalOfOcorrencias);

router.patch("/edit-ocorrencia/:id", ocorrenciaController.editOcorrencia);

router.delete("/delete-ocorrencia/:id", ocorrenciaController.deleteOcorrencia);

module.exports = router;