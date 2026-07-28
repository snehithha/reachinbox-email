import { Router } from "express";
import {
  scheduleEmail,
  getAllEmails,
} from "../controllers/email.controller";

const router = Router();

router.post("/schedule", scheduleEmail);
router.get("/", getAllEmails);

export default router;