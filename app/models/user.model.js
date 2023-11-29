const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    sName: { type: String, required: [true, 'Please enter Name.'] },
    sEmail: { type: String, required: [true, 'Please enter Email.'] },
    iMobile: Number,
    sOccupation: { type: String, required: [true, 'Please enter Occupation.'] },
    iExperience:Number,
    iRange: { type: Number, required: [true, 'Please enter range.'] },
    sDOB: { type: String, default: '' },
    oFacebookLogin: {
      eStatus: {type: String, enum: ['y', 'n'], default: 'n'},
      sFaceBookId: {type: String, default: ''}
    },
    oGoogleLogin: {
      eStatus: {type: String, enum: ['y', 'n'], default: 'n'},
      sGoogleId: {type: String, default: ''}
    },
    sVerificationToken: {type: String},
    eStatus: { type: String, enum: ['y', 'n', 'd'], default: 'y' },
    sAvatar: { type: String, default: 'Profile' },
    oAddress: {
      sAddress: String,
      sLandmark: String,
      iPincode: Number,
      sCity: String,
      sState: String
    },
    eUserType: {type: String, enum: ['user', 'admin', 'guest','vendor'], default: 'user'},
    eGender: {type: String, enum: ['male', 'female', 'other'], default: ''},
    aJwtToken: [{
      sDeviceToken: String,
      sPushToken: String,
      sDeviceType: String,
      dLastLogin: {
        type: Date,
        default: Date.now
      },
      eLogin: {type: String, enum: ['y', 'n'], default: 'y'}
    }],
    // eIsOnline: {type: String, enum: ['Online', 'Offline'], default: 'Offline'},
    dCreatedDate: {type: Date, default: Date.now},
    updated_at: { type: Date, default: Date.now },
    sPassword: { type: String, required: [true, 'Please enter password.'] },
    
  })
);

module.exports = User;
