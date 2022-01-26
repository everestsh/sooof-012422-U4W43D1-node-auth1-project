const Users = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  // console.log("restricted middleware!!!")
  // next()
  if (req.session.user) {
    next()
  } else {
    next({ status: 401, message: "You shall not pass!" })
  }
}

/*
  If the username in req.body already exists in req, res, nextt he database
  console.log("restricted middleware!!!")
  next()
  status 422
  {
    "message": "Username taken"
  }
*/
// TEST Err: http post  :9000/api/auth/register username=bob
// TEST: http post  :9000/api/auth/register username=bobmm

async function checkUsernameFree (req, res, next) {
  // console.log("checkUsernameFree middleware!!!")
  // next()
  try{
    const users = await Users.findBy({username: req.body.username})
    console.log(users)
    if(!users.length){
      next()
    }else{
      next({"message": "Username taken", status: 422})
    }
  }catch(err){
    next(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
// TEST: http post  :9000/api/auth/login username=bob
// TEST Err: http post  :9000/api/auth/login username=bobmm
async function checkUsernameExists(req, res, next) {
  // console.log("checkUsernameExists middleware!!!")
  // next()
  try{
    const users = await Users.findBy({username: req.body.username})
    console.log(users)
    if(users.length){
      req.user = users[0]
      next()
    }else{
      next({"message": "Invalid credentials", status: 401})
    }
  }catch(err){
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
// TEST: http post  :9000/api/auth/register username=bonnn password=1234
// TEST Err: http post  :9000/api/auth/register username=bonnn password=12
function checkPasswordLength(req, res, next) {
  // console.log("checkPasswordLength middleware!!!")
  // next()
  if(!req.body.password || req.body.password.length<3){
    next({ "message": "Password must be longer than 3 chars", status: 422})
  }else{
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength, 
}