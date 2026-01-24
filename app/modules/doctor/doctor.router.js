import express from "express";
import auth from "../../middlewares/authentication .js";
import * as doctorController from "./doctor-controller.js";
import myMulter from "../../middlewares/multer.js";
import * as doctorValidation from "./doctor-validation.js";
import { validation } from "../../middlewares/validation.js";

const routers=express.Router();
routers.get("/doctor-profile",auth(["doctor"]),doctorController.getDoctorProfile);
routers.patch("/update-profile",auth(["doctor"]),validation(doctorValidation.updateProfileValidation),myMulter().fields([{name:"profileImage",maxCount:1},{name:"files",maxCount:4}]),doctorController.updateprofile);
routers.delete("/delete-profile",auth(["doctor"]),doctorController.deleteProfile);






export default routers;