import express from "express";

import {
  listRecords,
  getSingleRecord,
  createNewRecord,
  updateExistingRecord,
  deleteExistingRecord,
} from "../controllers/salesforceController.js";

const router = express.Router();

router.get("/:objectName", listRecords);

router.get("/:objectName/:recordId", getSingleRecord);

router.post("/:objectName", createNewRecord);

router.patch("/:objectName/:recordId", updateExistingRecord);

router.delete("/:objectName/:recordId", deleteExistingRecord);

export default router;