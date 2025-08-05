const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/home", (req, res) => {
  res.send("this is home page");
});

app.get("/rich",(req,res)=>{
    res.send("get rich now")
})

app.listen(7000, () => {
  console.log("app listening on port 7000");
});
