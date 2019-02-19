'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let validateLocalStrategyProperty = function(property) {
	return (this.provider !== "local" && !this.updated) || property.length;
};

let validateLocalStrategyPassword = function(password) {
	return this.provider !== "local" || (password && password.length >= 6);
};

const UserSchema = Schema({
	name: {
		first: {
			type: String,
			trim: true,
			"default": "",
			validate: [validateLocalStrategyProperty, "Please fill in your full name"]
		},
		last: {
			type: String,
			trim: true,
			"default": "",
			validate: [validateLocalStrategyProperty, "Please fill in your full name"]
		}
	},
	fullName: {
		type: String,
		trim: true,
		"default": "",
		validate: [validateLocalStrategyProperty, "Please fill in your full name"]
	},
	oficialId:{
		type: String,
		trim: true
	},
	age: Number,
	sex: String,
	address: String,
	city: {
		type: String,
		trim: true
	},
	phone_number: String,
	email: {
		type: String,
		trim: true,
		unique: true,
		index: true,
		lowercase: true,
		"default": "",
		validate: [validateLocalStrategyProperty, "Please fill in your email"],
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	username: {
		type: String,
		unique: true,
		index: true,
		lowercase: true,
		required: "Please fill in a username",
		trim: true,
		match: [/^[\w][\w\-\._\@]*[\w]$/, "Please fill a valid username"]
	},
	password: {
		type: String,
		"default": "",
		validate: [validateLocalStrategyPassword, "Password should be longer"]
	},
	passwordLess: {
		type: Boolean,
		default: false
	},
	passwordLessToken: {
		type: String
	},
	provider: {
		type: String,
		"default": "local"
	},
	profile: {
		name: { type: String },
		gender: { type: String },
		picture: { type: String },
		location: { type: String }
	},
	socialLinks: {
		facebook: { type: String, unique: true, sparse: true },
		twitter: { type: String, unique: true, sparse: true },
		google: { type: String, unique: true, sparse: true },
		github: { type: String, unique: true, sparse: true }
	},
	roles: {
		type: [
			{
				type: String,
				"enum": [
					C.ROLE_ADMIN,
					C.ROLE_USER,
					C.ROLE_GUEST
				]
			}
		],
		"default": [C.ROLE_USER]
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,

	verified: {
		type: Boolean,
		default: false
	},

	verifyToken: {
		type: String
	},

	apiKey: {
		type: String,
		unique: true,
		index: true,
		sparse: true
	},

	lastLogin: {
		type: Date
	},

	locale: {
		type: String
	},

	status: {
		type: Number,
		default: 1
	},
});

UserSchema.statics.exists = function(email, callback){
    this.findOne({'local.email': email}, function (err, user){
      if(err){
        return callback(err);
      }
      if(!user){
        return callback(null, null);
      }else if(user){
        return callback(null, user);
      }
    });
};

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.local.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
