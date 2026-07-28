import { Request, Response } from "express";

export const scheduleEmail = async (
  req: Request,
  res: Response
) => {
  console.log(req.body);

  res.status(200).json({
    success: true,
    message: "Email request received",
  });
};