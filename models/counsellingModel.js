const mongoose = require("mongoose");
const counsilSchema = new mongoose.Schema(
  {
    facultyId: {
      type: String,
      required: true,
    },
    applicantNo: {
      type: String,
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    guardianMobile: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    courses: {
      course: {
        type: String,
        required: true,
      },

      branch: {
        type: String,
        required: true,
      },
    },
    qualifyingDegree: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    inquirySource: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    registrationDate: {
      type: String,
      required: true,
    },
    inquiryStatus: {
      type: String,
      default:"Approved"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("counsil", counsilSchema);
