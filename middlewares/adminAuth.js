const userModel = require("../models/userModel")
const islogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
       const adminUser = await userModel.findOne({
      _id: req.session.user_id,
       });
      if (adminUser.is_admin === 1) {
        req.user = adminUser;
        next(); // Allow access to the admin route
      }
      
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const islogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.redirect("/admin/home");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = {
  islogin,
  islogout,
};
