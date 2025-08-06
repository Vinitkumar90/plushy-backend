const express = require("express");
const app = express();


app.get("/admin/getUsers",(req,res)=>{
  try{
    //going for a db call

    throw new Error("affafsd");
    res.send("all users data sent");
  }catch(err){
    res.status(500).send("internal server error")
  }
})



app.listen(7000, () => {
  console.log("app listening on port 7000");
});
