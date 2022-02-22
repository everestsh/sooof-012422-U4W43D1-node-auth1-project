// const Users = require('../users/users-model')
// /*
//   If the user does not have a session saved in the server

//   status 401
//   {
//     "message": "You shall not pass!"
//   }
// */
// function restricted(req, res, next) {
//   // console.log( "restricted  middleware")
//   // next()
//   if(!req.session.user){
//     next()
//   }else{
//     next({ status: 401, message: "You shall not pass!" })
//   }
// }

// /*
//   If the username in req.body already exists in the database

//   status 422
//   {
//     "message": "Username taken"
//   }
// */
// async function checkUsernameFree(req, res, next) {
//   // console.log( "checkUsernameFree  middleware")
//   // next()
//   try{
//     const user = await Users.findBy({username: req.body.username})
//     // console.log(user)
//     if (!user){
//       next()
//     }else{
//       next({status: 422, message: "Username taken"})
//     }
//   }catch(err){
//     next(err)
//   }
// }

// /*
//   If the username in req.body does NOT exist in the database

//   status 401
//   {
//     "message": "Invalid credentials"
//   }
// */
// async function checkUsernameExists(req, res, next) {
//   // console.log( "checkUsernameExists  middleware")
//   // next()
//   try{
//     const user = await Users.findBy({username: req.body.username})
//     // console.log(user)
//     if(user){
//       req.user = user
//       next()
//     }else{
//       next({status: 401, message: "Invalid credentials"})
//     }
//   }catch(err){
//     next(err)
//   }
// }

// /*
//   If password is missing from req.body, or if it's 3 chars or shorter

//   status 422
//   {
//     "message": "Password must be longer than 3 chars"
//   }
// */
// function checkPasswordLength(req, res, next) {
//   // console.log( "checkPasswordLength  middleware")
//   // next()
//   if(!req.body.password || req.body.password.length < 3 ){
//     next({ status: 422, message: "Password must be longer than 3 chars"})
//   }else{
//     next()
//   }
// }

// // Don't forget to add these to the `exports` object so they can be required in other modules

// module.exports = {
//   restricted,
//   checkUsernameFree,
//   checkUsernameExists,
//   checkPasswordLength,
// }



   
const Users = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
    // console.log('restricted endpoint!!!')
    // next()
    if (req.session.user) {
      next()
    } else {
      next({ status: 401, message: "You shall not pass!" })
    }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  // console.log('checkUsernameFree endpoint!!!')
  // next()
  const { username } = req.body
  try {
    const existingUsername = await Users.findBy({username})
    if (existingUsername) {
      return next({ status: 422, message: "Username taken" })
    } else {
      next()
    }
  } catch (err) {
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
async function checkUsernameExists(req, res, next) {

  const { username } = req.body
  try {
    const returningUser = await Users.findBy({username})
    if (!returningUser) {
     return next({ status: 401, message: "Invalid credentials"})
    } else {
      next()
    }
  } catch (err) {
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
function checkPasswordLength(req, res, next) {

  const { password } = req.body
  if (!password || password.length < 3) {
    next({ status: 422, message: "Password must be longer than 3 chars"})
  } else {
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