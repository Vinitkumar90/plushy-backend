const express = require("express");
const app = express();

//query
// http://localhost:7000/card?id=123&ui=vinit
app.get("/card",(req,res)=>{
  console.log(req.query);
  res.send("hello from card")
})

//for dynamic routing
//http://localhost:7000/hello/123/90
app.get("/hello/:id/:game",(req,res)=>{
  console.log(req.params);                   // { id: '123', game: '90' }
  res.send("hello bro is seeing params")
})

app.post("/user",(req,res)=>{
  //saving data to db logic
  //sending confirmation
  res.send("data saved to db")
})

app.listen(7000, () => {
  console.log("app listening on port 7000");
});
