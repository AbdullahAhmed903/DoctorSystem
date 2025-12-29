import express from "express";
import auth from "../../middlewares/authentication .js";
import * as doctorController from "./doctor-controller.js";
import myMulter from "../../utils/multer.js";

const routers=express.Router();
routers.get("/doctor-profile",auth(["doctor"]),doctorController.getDoctorProfile);
routers.patch("/update-profile",auth(["doctor"]),myMulter().fields([{name:"image",maxCount:1},{name:"files",maxCount:4}]),doctorController.updateprofile);
routers.delete("/delete-profile",auth(["doctor"]),doctorController.deleteProfile);






export default routers;