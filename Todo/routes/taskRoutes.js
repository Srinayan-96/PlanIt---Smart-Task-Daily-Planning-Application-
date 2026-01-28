const express=require("express");
console.log("taskRoutes file LOADED");
const router=express.Router();

const { 
    getTasks, 
    addTask, 
    updateTask, 
    deleteTask,
    toggleTask
} = require("../controllers/taskController.js");

router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/",addTask);
router.get("/",getTasks);
router.patch("/:id/toggle",toggleTask);




module.exports=router;