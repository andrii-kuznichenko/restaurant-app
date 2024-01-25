const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      unique: true,
      required: [true, 'Login is required'],
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'Email address is required'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Passwords MUST be at least 8 characters'],
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required:[true, 'Restaurant reference is required']
    },
  },
  { timestamps: true },
);
// by default mongoose will not treat unique fields errors similar to other validation errors so by adding this we are returning the same error message structure so later we can use it in our frontend
AdminSchema.path('email').validate(async value => {
  const emailCount = await mongoose.models.Admin.countDocuments({ email: value });
  return !emailCount;
}, 'Email already exists');

AdminSchema.path('login').validate(async value => {
  const loginCount = await mongoose.models.Admin.countDocuments({ login: value });
  return !loginCount;
}, 'Login already exists');
//Virtual field
//stores info from our req, but will not be saved to the
//collection/db (need conf pass, but not storing it)
// MAKE SURE THE "_confirmPassword" start with "_"
AdminSchema.virtual('confirmPassword')
  .get(() => this._confirmPassword)
  .set(value => (this._confirmPassword = value));

//https://mongoosejs.com/docs/middleware.html#pre
//https://mongoosejs.com/docs/middleware.html
//middleware affects/aides in the middle of a process
//pre validate automatically runs before any save middleware ... makes this go before the next one

// ALL MIDDLEWARE FUNCTIONS NEED TO BE IN es5 FUNCTIONS NOT ARROW FUNCTIONS
AdminSchema.pre('validate', function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate('confirmPassword', 'Passwords must match!!!');
    console.log("Passwords don't match!");
  }
  next();
});

AdminSchema.pre('save', async function (next) {
  console.log('in pre save');
  //hash the password BEFORE it's saved to the db
  //Remember, we know they match from middleware above
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    //give our password the value of the returned hash
    console.log('HASHED', hashedPassword);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log('IS THERE ANY ERROR', error);
  }
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;