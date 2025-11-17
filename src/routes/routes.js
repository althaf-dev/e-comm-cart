const express =  require("express");
const data = require("../utils/raw_data")

const router = express.Router();

router.post("/",(req,res)=>{
    console.log(data);
    res.status(200).json(data)
});

router.delete("/",(req,res)=>{
    console.log(data);
    res.status(200).json(data)
});



module.exports = router;