const adminAuth = (req,res,next) => {
  const token = "abc";
  console.log("admin auth is getting checked");
  const isAuthorized = token === "abc";
  if(!isAuthorized){
    res.status(401).send("unauthorized")
  }else{
    next();
  }
}

const userAuth = (req,res,next) => {
  const token = "abc";
  const isAuthorized = token === "abc";
  if(!isAuthorized){
    res.status(401).send("unauthorized")
  }else{
    next();
  }
}

module.exports = {
    adminAuth,
    userAuth
}