const router = require('express').Router();
const jwt = require('jsonwebtoken');
var User = require('../models/user.model');

router.get('/', (req, res, next) => {
  res.send(`hello from auth`);
});

// signup
router.post('/signup', (req, res, next) => {
  const { email, username, password } = req.body;
  const user = new User({
    email,
    username,
    password
  });

  const { secretKey } = req.config;

  (async () => {
    try {
      const createdUser = await user.save();
      jwt.sign(
        {
          email: createdUser.email,
          username: createdUser.username
        },
        secretKey,
        {
          expiresIn: '7d',
          issuer: 'viveloper.com',
          subject: 'userInfo'
        },
        (err, token) => {
          if (!err) {            
            res.status(201).json({
              success: true,
              message: 'user added.',                
              token
            });
          }
          else {
            res.status(500).json({
              success: false,
              message: 'token creation failure.'
            });
          }
        }
      )
    }
    catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'failed to signup.'
      });
    }
  })();
});

// signin
router.post('/signin', (req, res, next) => {
  const { email, password } = req.body;  
  const { secretKey } = req.config;

  (async () => {
    try {
      const user = await User.findOne({
        email, 
        password
      });
      if(user){
        jwt.sign(
          {
            email: user.email,
            username: user.username
          },
          secretKey,
          {
            expiresIn: '7d',
            issuer: 'viveloper.com',
            subject: 'userInfo'
          },
          (err, token) => {
            if (!err) {            
              res.status(200).json({
                success: true,
                message: 'signin success.',                
                token
              });
            }
            else {
              res.status(500).json({
                success: false,
                message: 'token creation failure.'
              });
            }
          }
        )
      }   
      else{
        res.status(401).json({
          success: false,
          message: 'email or password is wrong.'
        });
      }   
    }
    catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'failed to signin.'
      });
    }
  })();
});

module.exports = router;