const express = require("express");
const router = express.Router();
const session = require('express-session')
const config = require('../config/config')
const AdminController = require('../controllers/adminController')

const adminAuth = require('../middlewares/adminAuth')

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


router.get('/',adminAuth.islogout,AdminController.loadLogin)
router.post('/login',AdminController.verifyUser)
router.get('/home',AdminController.loadDashboard)
router.get('/logout', adminAuth.islogin, AdminController.logout)
router.get("/forgot",adminAuth.islogout, AdminController.forgotLoad);
router.post("/forgot", AdminController.forgotVerify);
router.get("/forgot-password",adminAuth.islogout, AdminController.forgotPasswordLoad);
router.post("/forgot-password", AdminController.resetPassword);


router.get('/new-user', adminAuth.islogin, AdminController.newUser)
router.post("/new-user", AdminController.addUser);

//actions edit
router.get('/edit-user',adminAuth.islogin,AdminController.editUserLoad)
router.post("/edit-user", AdminController.updateUserLoad);

router.get("/delete-user", adminAuth.islogin, AdminController.deleteUserLoad);

router.get("/export-user", adminAuth.islogin, AdminController.exportUser);
router.get("/export-user-pdf", adminAuth.islogin, AdminController.exportUserPdf);



router.get("/inquiryDetails",AdminController.inquiryDetails);
router.get("/view/:id", AdminController.viewFullInquiry)
router.get("/edit/:id", AdminController.editInquiry);
router.post("/edit-user-inq", AdminController.updateInquiry);

router.get("/delete/:id", AdminController.deleteInquiry);
router.get("/teachersTable", AdminController.teachersTable);
router.get("/registrationData", AdminController.registrationDetails);


router.get("/fillINQ", AdminController.fillINQ);
router.post("/counsil", AdminController.counsil);
router.get("/viewreg/:id", AdminController.viewFullRegistration);
router.get("/editreg/:id", AdminController.editRegistration);
router.post("/edit-user-reg", AdminController.updateRegistration);



router.get("/registrationFormN", AdminController.registrationFormN);
router.get("/registration/:id", AdminController.registrationForm);
router.post("/registration", AdminController.registrationData);
router.get("/logs", AdminController.logs);


router.get("/print/:Id", AdminController.printForm);

router.get("/pendingForm", AdminController.pendingForm)
router.post("/updatestatus/:Id", AdminController.updatestatus);

router.get("/inquiryReports", AdminController.inquiryReports)
router.get("/registerReports", AdminController.registerReports);
router.get("/facultyLeave",AdminController.facultyLeave);



router.get('*', (req, res) => {
    res.redirect('/admin')
})










module.exports = router;