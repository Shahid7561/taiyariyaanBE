const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  let sDeviceToken = bcrypt.hashSync(req.body.sEmail + Math.random() + Date.now())
  let sVerificationToken = bcrypt.hashSync(req.body.sEmail + req.body.sPassword + Math.random() + Date.now())
  const user = new User({
    sName: req.body.sName,
    iMobile: req.body.iMobile,
    sEmail: req.body.sEmail,
    sOccupation: req.body.sOccupation,
    sPassword: bcrypt.hashSync(req.body.sPassword),
    iExperience: req.body.iExperience,
    iRange: req.body.iRange,
    sAvatar: req.body.sAvatar,
    eUserType: req.body.eUserType,
    eGender: req.body.eGender,
    aJwtToken: {
      sDeviceToken: sDeviceToken,
      sPushToken: '',
      sDeviceType: req.body.sDeviceType,
      eLogin: 'y'
    },
    oAddress : req.body.oAddress,
    sVerificationToken: sVerificationToken
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

      user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      
  });
};

exports.signin = (req, res) => {
  User.findOne({
    sEmail: req.body.sEmail,
  })
   
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.sPassword,
        user.sPassword
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      const token = jwt.sign({ id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });

      req.session.token = token;

      res.status(200).send({
       user
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
