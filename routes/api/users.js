//@login & register

const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt")
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys = require("../../config/keys")
const passport = require("passport")

const User = require('../../models/User')

router.get("/test", (req, res) => {
    res.json({msg: "login works"})
})
router.post("/register", (req, res) => {
    console.log(req.body);
    User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                return res.status(400).json("邮箱已被注册!")
            }else{
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'})
                console.log({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    identify:req.body.identify,
                    password: req.body.password
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    identify:req.body.identify,
                    password: req.body.password
                })
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if(err) throw err;

                        newUser.password = hash;

                        newUser.save()
                               .then(user => res.json({
                                  user
                               }))
                               .then(err => console.log(err));
                    });
                });
            }
        })
})

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if (!user) {
                return res.status(404).json("用户不存在")
            } else {
                bcrypt.compare(password, user.password)
                      .then(isMatch => {
                          if(isMatch) {
                              const rule = {id: user.id, name: user.name, identify:user.identify, avatar: user.avatar};
                              jwt.sign(rule,keys.secretOrKey,{expiresIn:3600}, (err, token) => {
                                 if (err) throw err;
                                 res.json({
                                    success: true,
                                    token: "Bearer " + token
                                })
                               })
                              //res.json({msg: "success"})
                          }else{
                              return res.status(400).json("账号或者密码错误")
                          }
                      })
            }
        })
})
router.get("/current",passport.authenticate("jwt", {session:false}), (req, res) => {
    res.json({
        id: req.user.id,
        name:req.user.name,
        email: req.user.email,
        identify:req.user.identify
    });
})
module.exports = router;