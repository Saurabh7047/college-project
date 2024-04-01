const userModel = require("../models/userModel");
const counsellingModel = require("../models/counsellingModel");
const registrationModel = require("../models/registrationModel");
const leave = require("../models/leaveModel")
const bcrypt = require("bcrypt");
const RandomString = require("randomstring");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const exceljs = require("exceljs");
const moment = require("moment");

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dywvtdtpy",
  api_key: "655265211765838",
  api_secret: "mN7DrgpBMlhqLzFxIOreh5gRJFE",
  secure: false,
});

// html to pdf
const ejs = require("ejs");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");

const { use } = require("../routes/adminRoutes");
const { response } = require("express");
const { clg } = require("./userController");

const sendResetPasswordMail = async (name, email, token) => {
  try {
    var transporter = nodemailer.createTransport({
      //   service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.userEmail,
        pass: config.userMailPassword,
      },
    });

    var mailOptions = {
      from: config.userEmail,
      to: email,
      subject: "For Reset Pasword",
      html:
        "Hello," +
        name +
        ',Thank you for registering. Please click the following link to reset password your email: <a href="http://localhost:3000/admin/forgot-password?token=' +
        token +
        '">forget password</a>"',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const sendUserMail = async (name, email, password, user_id) => {
  try {
    var transporter = nodemailer.createTransport({
      //   service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.userEmail,
        pass: config.userMailPassword,
      },
    });

    var mailOptions = {
      from: config.userEmail,
      to: email,
      subject: "Admin added you and verify your mail",
      html:
        "Hello," +
        name +
        ',Thank you for registering. Please click the following link to verify your email: <a href="http://localhost:3000/verify?id=' +
        user_id +
        '">verify</a>"<br><br><b>Email:- </b>' +
        email +
        "<br><b>password :-</b>" +
        password +
        "",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

class AdminController {
  static loadLogin = async (req, res) => {
    try {
      res.render("admin/login");
    } catch (error) {
      console.log(error.message);
    }
  };
  static verifyUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await userModel.findOne({ email: email });
      if (userData) {
        const isMatch = await bcrypt.compare(password, userData.password);
        if (isMatch) {
          if (userData.is_admin === 0) {
            res.render("admin/login", {
              message: "Email and password is incorrect",
            });
          } else {
            req.session.user_id = userData._id;
            res.redirect("/admin/home");
          }
        } else {
          res.render("admin/login", {
            message: "Email and password is incorrect",
          });
        }
      } else {
        res.render("admin/login", {
          message: "Email and password is incorrect",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  static loadDashboard = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });
      res.render("admin/home", { admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };

  static logout = async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/admin");
    } catch (error) {
      console.log(error.message);
    }
  };

  static forgotLoad = async (req, res) => {
    try {
      res.render("admin/forgot");
    } catch (error) {
      console.log(error.message);
    }
  };
  static forgotVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await userModel.findOne({ email: email });
      if (userData) {
        if (userData.is_admin === 0) {
          res.render("admin/forgot", { message: "Email is incorrect" });
        } else {
          const randomStr = RandomString.generate();
          const upadateData = await userModel.updateOne(
            { email: email },
            { $set: { token: randomStr } }
          );
          sendResetPasswordMail(userData.name, userData.email, randomStr);
          res.render("admin/forgot", {
            message: "Please check your mail to reset password",
          });
        }
      } else {
        res.render("admin/forgot", { message: "Email is incorrect" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  static forgotPasswordLoad = async (req, res) => {
    try {
      const { token } = req.query;
      const tokenData = await userModel.findOne({ token: token });
      if (tokenData) {
        res.render("admin/forgot-password", { user_id: tokenData._id });
      } else {
        res.status(400).send("Invalid or expired verification token.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //reset password here
  static resetPassword = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const securePassword = await bcrypt.hash(password, 10);
      const Data = await userModel.findByIdAndUpdate(
        { _id: user_id },
        { $set: { password: securePassword, token: "" } }
      );
      res.redirect("/admin");
    } catch (error) {
      console.log(error.message);
    }
  };

  static newUser = async (req, res) => {
    try {
      const userDetails = await userModel.findOne({ _id: req.session.user_id });

      res.render("admin/newUser", { admin: userDetails });
    } catch (error) {
      console.log(error.message);
    }
  };
  static addUser = async (req, res) => {
    try {
      const userDetails = await userModel.findOne({ _id: req.session.user_id });

      const imageFile = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(
        imageFile.tempFilePath,
        {
          folder: "profileImage",
        }
      );
      const { name, email, mobile } = req.body;
      // const image = req.file.filename;
      const password = RandomString.generate(8);
      const securePassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        name: name,
        email: email,
        mobile: mobile,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
        password: securePassword,
        is_admin: 0,
      });
      const userData = await newUser.save();
      if (userData) {
        sendUserMail(name, email, password, userData._id);
        res.redirect("/admin/dashboard");
      } else {
        res.render("admin/newUser", { admin: userDetails });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  static editUserLoad = async (req, res) => {
    try {
      const { id } = req.query;
      const userData = await userModel.findById({ _id: id });
      if (userData) {
        res.render("admin/editUser", { user: userData });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  static updateUserLoad = async (req, res) => {
    try {
      const { name, email, mobile } = req.body;
      const updateUser = await userModel.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            name: name,
            email: email,
            mobile: mobile,
          },
        }
      );
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log(error.message);
    }
  };
  static deleteUserLoad = async (req, res) => {
    try {
      const { id } = req.query;
      await userModel.deleteOne({ _id: id });
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.log(error.message);
    }
  };
  //excel
  static exportUser = async (req, res) => {
    try {
      const workBook = new exceljs.Workbook();
      const workSheet = workBook.addWorksheet("my User");
      workSheet.columns = [
        { header: "S.no", key: "s_no" },
        { header: "Name", key: "name" },
        { header: "Email ID", key: "email" },
        { header: "Mobile", key: "mobile" },
        { header: "Image", key: "image" },
        { header: "Is Admin", key: "is_admin" },
        { header: "Is Verified", key: "is_verified" },
      ];
      let counter = 1;
      const userData = await userModel.find({ is_admin: 0 });
      userData.forEach((user) => {
        user.s_no = counter;
        workSheet.addRow(user);
        counter++;
      });
      workSheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
      );

      res.setHeader("Content-Disposition", `attachement; filename=users.xlsx`);

      return workBook.xlsx.write(res).then(() => {
        res.status(200);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // pdf
  static exportUserPdf = async (req, res) => {
    try {
      const userData = await userModel.find({ is_admin: 0 });
      const data = {
        users: userData,
      };
      const filePathName = path.resolve(
        __dirname,
        "../views/admin/htmltopdf.ejs"
      );
      const htmlString = fs.readFileSync(filePathName).toString();
      let options = {
        format: "Letter",
        orientation: "portrait",
        border: "10mm",
      };
      const ejsData = ejs.render(htmlString, data);
      pdf.create(ejsData, options).toFile("users.pdf", (err, response) => {
        if (err) console.log(err);
        //  console.log('file generated')

        const filePath = path.resolve(__dirname, "../users.pdf");
        fs.readFile(filePath, (err, file) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Could not download file");
          }
          res.setHeader("Content-Type", "application/pdf");

          res.setHeader(
            "Content-Disposition",
            `attachement; filename=users.pdf`
          );

          res.send(file);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  static inquiryDetails = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });

      var searchinq1 = "";
      if (req.query.searchinq1) {
        searchinq1 = req.query.searchinq1;
      }
      // console.log(searchreq1);

      var searchinq2 = "";
      if (req.query.searchinq2) {
        searchinq2 = req.query.searchinq2;
      }
      // console.log(searchreq2);

      const usersinq = await counsellingModel
        .find({
          // multiple searching
          $and: [
            {
              $or: [
                {
                  registrationDate: { $regex: "^" + searchinq1, $options: "i" },
                }, // Assuming 'dateField' is the name of the date field
              ],
            },
            {
              $or: [
                {
                  applicantName: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  applicantNo: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { mobile: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                {
                  fatherName: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { email: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                // { fatherName: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                {
                  "courses.course": {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  "courses.branch": {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { dateField: { $regex: "^" + searchinq2, $options: "i" } }, // Assuming 'dateField' is the name of the date field
              ],
            },
          ],

          // Add more conditions here using $and operator if needed
        })
        .exec();
      res.render("admin/inquiryDisplay", {
        user: usersinq,
        admin: userData,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  static teachersTable = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });
      const data = await userModel.find({ is_admin: 0 });
      res.render("admin/teachersTable", { data: data, admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static registrationDetails = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });

      var searchreq1 = "";
      if (req.query.searchreq1) {
        searchreq1 = req.query.searchreq1;
      }
      // console.log(searchreq1);

      var searchreq2 = "";
      if (req.query.searchreq2) {
        searchreq2 = req.query.searchreq2;
      }
      // console.log(searchreq2);

      const usersreq = await registrationModel
        .find({
          // multiple searching
          $and: [
            {
              $or: [
                {
                  registrationDate: { $regex: "^" + searchreq1, $options: "i" },
                }, // Assuming 'dateField' is the name of the date field
              ],
            },
            {
              $or: [
                {
                  studentName: {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  applicantNo: {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
                { mobile: { $regex: ".*" + searchreq2 + ".*", $options: "i" } },
                {
                  fatherName: {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
                { email: { $regex: ".*" + searchreq2 + ".*", $options: "i" } },
                // { fatherName: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                {
                  "courses.course": {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  "courses.branch": {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
              ],
            },
          ],

          // Add more conditions here using $and operator if needed
        })
        .exec();
      res.render("admin/registrationData", {
        user: usersreq,
        admin: userData,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  static viewFullInquiry = async (req, res) => {
    try {
      const data = await counsellingModel.findById(req.params.id);
      const userData = await userModel.findOne({ _id: req.session.user_id });

      res.render("admin/view", { view: data, admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static viewFullRegistration = async (req, res) => {
    try {
      const data = await registrationModel.findById(req.params.id);
      const userData = await userModel.findOne({ _id: req.session.user_id });

      res.render("admin/viewFullRegistration", { view: data, admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static editInquiry = async (req, res) => {
    try {
      const data = await counsellingModel.findById(req.params.id);
      const userData = await userModel.findOne({ _id: req.session.user_id });

      res.render("admin/editUser", { user: data, admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static editRegistration = async (req, res) => {
    try {
      const data = await registrationModel.findById(req.params.id);
      const userData = await userModel.findOne({ _id: req.session.user_id });

      res.render("admin/editRegistration", { user: data, admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static deleteInquiry = async (req, res) => {
    try {
      const { id } = req.params;
      await counsellingModel.deleteOne({ _id: id });
      res.redirect("back");
    } catch (error) {
      console.log(error.message);
    }
  };

  static updateRegistration = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });
      const { name, email, mobile } = req.body;
      const updateUser = await registrationModel.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            studentName: name,
            email: email,
            mobile: mobile,
          },
        }
      );
      res.render("admin/viewFullRegistration", {
        view: updateUser,
        admin: userData,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  static updateInquiry = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });

      const { name, email, mobile } = req.body;
      const updateUser = await counsellingModel.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            applicantName: name,
            email: email,
            mobile: mobile,
          },
        }
      );

      res.render("admin/view", { view: updateUser, admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static fillINQ = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });
      res.render("admin/fillINQ", { admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static counsil = async (req, res) => {
    try {
      const userUpData = await userModel.findOne({ _id: req.session.user_id });
      function getRandomThreeDigitNumber() {
        // Generate a random number between 100 and 999
        return Math.floor(Math.random() * 9000) + 1000;
      }
      const random = getRandomThreeDigitNumber();
      const applicantNo = `090524` + random;
      var today = new Date();
      // Calculate two days before today
      var twoDaysBefore = new Date();
      twoDaysBefore.setDate(today.getDate() - 2);
      var formattedDate = twoDaysBefore.toISOString().split("T")[0];
      const {
        applicantName,
        email,
        mobile,
        guardianMobile,
        dob,
        gender,
        address,
        course,
        branch,

        qualifyingDegree,
        fatherName,
        state,
        city,
        inquirySource,
        status,
      } = req.body;
      const newData = new counsellingModel({
        facultyId: userUpData._id,
        applicantNo: applicantNo,
        applicantName: applicantName,
        email: email,
        mobile: mobile,
        guardianMobile: guardianMobile,
        dob: dob,
        gender: gender,
        address: address,
        courses: {
          course: course,
          branch: branch,
        },
        qualifyingDegree: qualifyingDegree,
        fatherName: fatherName,
        state: state,
        city: city,
        inquirySource: inquirySource,
        status: status,
        registrationDate: dateString,
        inquiryStatus:
          registrationDate < formattedDate ? "pending" : "Approved",
      });
      const userData = await newData.save();
      res.render("admin/view", { view: userData, admin: userUpData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static registrationFormN = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });
      res.render("admin/registrationFormN", { admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static registrationForm = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });

      const data = await counsellingModel.findById(req.params.id);

      res.render("admin/registrationForm", { user: data, admin: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  static registrationData = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });
      const facultyId = userData._id;
      console.log(facultyId);
      function getRandomThreeDigitNumber() {
        // Generate a random number between 100 and 999
        return Math.floor(Math.random() * 9000) + 1000;
      }
      const branchRoll = req.body.branch;
      const random = getRandomThreeDigitNumber();
      const applicantNo = `090524` + branchRoll + random;

      const dateString = moment().format("YYYY-MM-DD");
      const {
        studentName,
        dob,
        fatherName,
        motherName,
        occupation,
        address,
        gender,
        email,
        nationality,
        category,
        mobile,
        guardianMobile,
        course,
        branch,

        state,
        city,
        degreeName,
        percentage,
        examinationAuthority,
        subjectStream,
        passingYear,
        paymentMode,
        amount,
        receiptNumber,
        receiptDate,
        jeeEnrollmentNumber,
        jeeMarksPercentile,
        jeeRank,
        schemeOpted,
        inquirySource,
        // status,
        hostel,
        busExeption,
        registrationStatus,

        facultyName,
        referralName,
      } = req.body;
      const registerData = new registrationModel({
        facultyId: facultyId,
        applicantNo: applicantNo,
        studentName: studentName,
        dob: dob,
        fatherName: fatherName,
        motherName: motherName,
        occupation: occupation,
        address: address,
        gender: gender,
        email: email,
        nationality: nationality,
        category: category,
        mobile: mobile,
        guardianMobile: guardianMobile,
        courses: {
          course: course,
          branch: branch,
        },

        location: { state: state, city: city },

        qualifyingDegree: {
          degreeName: degreeName,
          percentage: percentage,
          examinationAuthority: examinationAuthority,
          subjectStream: subjectStream,
          passingYear: passingYear,
        },
        registrationFee: {
          paymentMode: paymentMode,
          amount: amount,
          receiptNumber: receiptNumber,
          receiptDate: receiptDate,
        },
        jeeMains: {
          jeeEnrollmentNumber: jeeEnrollmentNumber,
          jeeMarksPercentile: jeeMarksPercentile,
          jeeRank: jeeRank,
        },
        schemeOpted: schemeOpted,
        inquirySource: inquirySource,
        // status: status,
        additionDetails: {
          hostel: hostel,
          busExeption: busExeption,
        },
        registrationStatus: registrationStatus,
        registrationDate: dateString,
        referralName: referralName,
        facultyName: facultyName,
      });

      const registeredData = await registerData.save();
      res.render("admin/viewFullRegistration", {
        view: registeredData,
        admin: userData,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  static logs = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });

      var searchinq1 = "";
      if (req.query.searchinq1) {
        searchreq1 = req.query.searchinq1;
      }
      // console.log(searchreq1);

      var searchinq2 = "";
      if (req.query.searchinq2) {
        searchreq2 = req.query.searchinq2;
      }
      // console.log(searchreq2);

      const usersinq = await counsellingModel
        .find({
          // multiple searching
          $and: [
            {
              $or: [
                {
                  registrationDate: { $regex: "^" + searchinq1, $options: "i" },
                }, // Assuming 'dateField' is the name of the date field
              ],
            },
            {
              $or: [
                {
                  applicantName: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  applicantNo: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { mobile: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                {
                  fatherName: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { email: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                // { fatherName: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                {
                  "courses.course": {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  "courses.branch": {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { dateField: { $regex: "^" + searchinq2, $options: "i" } }, // Assuming 'dateField' is the name of the date field
              ],
            },
          ],

          // Add more conditions here using $and operator if needed
        })
        .exec();
      res.render("admin/logs", {
        user: usersinq,
        admin: userData,
      });
    } catch (error) {
      console.log(err.message);
    }
  };
  static inquiryReports = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });

      var searchinq1 = "";
      if (req.query.searchinq1) {
        searchinq1 = req.query.searchinq1;
      }
      // console.log(searchreq1);

      var searchinq2 = "";
      if (req.query.searchinq2) {
        searchinq2 = req.query.searchinq2;
      }
      // console.log(searchreq2);

      const usersinq = await counsellingModel
        .find({
          // multiple searching
          $and: [
            {
              $or: [
                {
                  registrationDate: { $regex: "^" + searchinq1, $options: "i" },
                }, // Assuming 'dateField' is the name of the date field
              ],
            },
            {
              $or: [
                {
                  applicantName: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  applicantNo: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { mobile: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                {
                  fatherName: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { email: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                // { fatherName: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                {
                  "courses.course": {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  "courses.branch": {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                { dateField: { $regex: "^" + searchinq2, $options: "i" } }, // Assuming 'dateField' is the name of the date field
              ],
            },
          ],

          // Add more conditions here using $and operator if needed
        })
        .exec();
      res.render("admin/inquiryReports", {
        user: usersinq,
        admin: userData,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  static registerReports = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });

      var searchreq1 = "";
      if (req.query.searchreq1) {
        searchreq1 = req.query.searchreq1;
      }
      // console.log(searchreq1);

      var searchreq2 = "";
      if (req.query.searchreq2) {
        searchreq2 = req.query.searchreq2;
      }
      // console.log(searchreq2);

      const usersreq = await registrationModel
        .find({
          // multiple searching
          $and: [
            {
              $or: [
                {
                  registrationDate: { $regex: "^" + searchreq1, $options: "i" },
                }, // Assuming 'dateField' is the name of the date field
              ],
            },
            {
              $or: [
                {
                  studentName: {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  applicantNo: {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
                { mobile: { $regex: ".*" + searchreq2 + ".*", $options: "i" } },
                {
                  fatherName: {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
                { email: { $regex: ".*" + searchreq2 + ".*", $options: "i" } },
                // { fatherName: { $regex: ".*" + searchinq2 + ".*", $options: "i" } },
                {
                  "courses.course": {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  "courses.branch": {
                    $regex: ".*" + searchreq2 + ".*",
                    $options: "i",
                  },
                },
              ],
            },
          ],

          // Add more conditions here using $and operator if needed
        })
        .exec();
      res.render("admin/registerReports", {
        user: usersreq,
        admin: userData,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  static facultyLeave = async (req, res) => {
    try {
        
      const userData = await userModel.findOne({ _id: req.session.user_id });

      var searchinq1 = "";
      if (req.query.searchinq1) {
        searchinq1 = req.query.searchinq1;
      }
      // console.log(searchreq1);

      var searchinq2 = "";
      if (req.query.searchinq2) {
        searchinq2 = req.query.searchinq2;
      }
      // console.log(searchreq2);

      const usersinq = await leave
        .find({
          // multiple searching
          $and: [
            {
              $or: [
                {
                  currentDate: { $regex: "^" + searchinq1, $options: "i" },
                }, // Assuming 'dateField' is the name of the date field
              ],
            },
            {
              $or: [
                {
                  facultyName: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                {
                  leaveType: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                
                {
                  leaveStart: {
                    $regex: ".*" + searchinq2 + ".*",
                    $options: "i",
                  },
                },
                
              ],
            },
          ],

          // Add more conditions here using $and operator if needed
        })
        .exec();
      res.render("admin/facultyLeave", {
        user: usersinq,
        admin: userData,
      });
    
      
      
    } catch (error) {
      console.log(err.message);
    }
  };
  static pendingForm = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });
      const users = await counsellingModel.find({ inquiryStatus: "pending" });
      res.render("admin/pendingForms", {
        data: users,
        admin: userData,
      });
    } catch (error) {
      console.log(err.message);
    }
  };
  static updatestatus = async (req, res) => {
    try {
      const userData = await userModel.findOne({ _id: req.session.user_id });

      const data = await counsellingModel.find({ inquiryStatus: "pending" });
      const update = await counsellingModel.findByIdAndUpdate(req.params.Id, {
        inquiryStatus: req.body.status,
      });

      //  this.sendMail(name, email, status, comment);
      res.render("admin/pendingForms", { data: data, admin: userData });
    } catch (error) {
      console.log(error);
    }
  };
  static printForm = async (req, res) => {
    try {
      const user = await registrationModel.findOne({ _id: req.params.Id });
      // console.log(user)
      res.render("users/PrintForm", { data: user });
    } catch (error) {
      console.log(err.message);
    }
  };
}

module.exports = AdminController;
