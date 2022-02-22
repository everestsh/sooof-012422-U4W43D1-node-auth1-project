// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router()
const User = require('../users/users-model')
const bcrypt = require('bcryptjs')
const { checkUsernameFree, 
  checkUsernameExists,
  checkPasswordLength
  } = require('./auth-middleware')
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
//  http post :9000/api/auth/register
// http post :9000/api/auth/register username=aaa password=1234 -v
  router.post('/register', checkPasswordLength, checkUsernameFree, async (req, res, next) => { 
    // res.json({message: "register "})
    // way 1
    try{
      const {username, password} = req.body
      const hash = bcrypt.hashSync(password, 8)
      const user = await User.add({username: username, password: hash})
      res.status(201).json(user)
    }catch(err){
      next(err)
    }

    
   // way 2
  //  const {username, password} = req.body 
  //  const hash = bcrypt.hashSync(password, 8)
  //  User.add({username , password: hash})
  //    .then( saved=>{
  //      res.status(201).json(saved)
  //    })
  //    .catch(next)
  })
 
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
// http post :9000/api/auth/login  
// http post :9000/api/auth/login username=aaa password=1234 -v
  router.post('/login', checkUsernameExists, async (req, res, next) => { 
    // res.json({message: "login "})
// try{
//   const password = req.body.password
//   if(bcrypt.compareSync(password, req.user.password) == true) {
//     req.session.user = req.user
//     res.json(`Welcome ${req.user.username}!`)
//   }else{
//     next({status: 401, message:"Invalid credentials" })
//   }
// }catch(err){
//   next(err)
// }
    // way 2
    // const password = req.body.password;
    //   // console.log("data password =", req.user.password)
    //   // console.log("body password = ", password)
    //   // console.log(bcrypt.compareSync(password, req.user.password))
    // if(bcrypt.compareSync(password, req.user.password) == true) {
    //     req.session.user = req.user;
    //     res.json(`Welcome ${req.user.username}!`);
    // } else {
    //     next({ status: 401, message: 'invalid credentials provided!' });
    // }
    // way 3
    const { username, password } = req.body
    try {
      const user = await User.findBy({username})
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
       return next({ status: 401, message: "Invalid credentials"})
      }
      req.session.user = user
      res.status(200).json({ message: `Welcome ${user.username}!`})
    } catch (err) {
      next(err)
    }
  })

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
// http get :9000/api/auth/logout
  // router.get('/logout',  async (req, res, next) => { 
  //   // res.json({message: "logout "})
  //   if(req.session.user){
  //     req.session.destroy(err =>{
  //       if(err){
  //         next({ status: 500, message: "error while logging out"})
  //       }else{
  //         res.status(200).json({ message: "logged out"})
  //       }
  //     })
  //   }else{
  //     next({ status: 200, message: "no session"})
  //   }
    
  // })

  router.get('/logout', async (req, res, next) => {
    if(!req.session.user) {
      next({ status: 200, message: "no session"})
    } else {
      req.session.destroy((err) => {
        if (err) {
          next({ status: 500, message: "Something went wrong trying to logout"})
        } else {
          res.status(200).json({ message: "logged out"})
        }
      })
    }
  })
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router