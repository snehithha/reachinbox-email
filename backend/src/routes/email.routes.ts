import { Router } from "express";
import {
  scheduleEmail,
  getEmailById,
  updateEmail,
  deleteEmail,
  getAllEmails,
} from "../controllers/email.controller";
console.log("✅ email.routes.ts loaded");
const router = Router();

router.post("/schedule", scheduleEmail);
router.get("/test", (req, res) => {
  res.json({ message: "TEST ROUTE WORKING" });
});
router.put("/:id", updateEmail);
router.delete("/:id", deleteEmail);
router.get("/:id", getEmailById);
router.get("/", getAllEmails);


export default router;