const express = require('express');
const router = express.Router();
const session = require('express-session')
const userControl = require('../controllers/userController')
const auth = require('../middlewares/auth')
const multer = require("multer");
const path = require("path");
const stroage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: stroage });

router.get("/", userControl.login);
// router.get("/clg", userControl.clg);
router.get("/clg", userControl.Dashboard);

router.get("/fillINQ", userControl.fillINQ);
router.post("/counsil", userControl.counsil);
router.get("/registrationForm", userControl.registrationForm);
router.post("/registrationFrom", userControl.registrationData);
router.get("/viewreg/:id", userControl.viewFullRegistration);
router.get("/editreg/:id", userControl.editRegistration);
router.get("/registration/:id", userControl.registrationFormF);
router.post("/edit-user-inq", userControl.updateInquiry);

router.post("/edit-user-reg", userControl.updateRegistration);

router.get("/leaveForm", userControl.leaveForm);
router.post("/leaveForm", userControl.leaveLoad);





router.get('/register',auth.islogout, userControl.loadRegister)
router.post("/register", userControl.createUser);
router.get('/verify', userControl.verifyMail)
router.get("/login", userControl.login);
router.post('/login',userControl.verifyLogin)
router.get("/users/home", auth.islogin, userControl.home);
router.get("/home", auth.islogin, userControl.home);
router.get('/logout', auth.islogin, userControl.userlogout)
// password reset
router.get('/forgot',auth.islogout,userControl.forgotLoad)
router.post("/forgot",userControl.forgotverify);
router.get('/forgot-password',auth.islogout,userControl.forgotPassword)
router.post("/forgot-password", userControl.ResetPassword);

router.get('/verification',userControl.verification)
router.post("/verification", userControl.sendVerification);

router.get('/editinq/:Id',auth.islogin,userControl.editload)
router.post('/edit', upload.single('image'), userControl.updateProfile)

router.get("/view/:id", userControl.viewFullInquiry);


router.get("/editinq/:Id", auth.islogin, userControl.editload);
router.post("/edit", upload.single("image"), userControl.updateProfile);

router.get("/print/:Id",userControl.printForm)




module.exports = router;
