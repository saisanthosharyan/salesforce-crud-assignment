import express from "express";

import {
  loginWithSalesforce,
  salesforceCallback,
  getAuthStatus,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/salesforce", loginWithSalesforce);

router.get("/salesforce/callback", salesforceCallback);

router.get("/status", getAuthStatus);

router.post("/logout", logout);

export default router;