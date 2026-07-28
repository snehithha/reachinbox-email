import express from "express";
import cors from "cors";
import emailRoutes from "./routes/email.routes";

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/email", emailRoutes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "ReachInbox Email Scheduler API"
  });
});

export default app;