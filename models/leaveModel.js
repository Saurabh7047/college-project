const mongoose = require("mongoose")
const leaveSchema = new mongoose.Schema(
  {
    facultyName: {
      type: String,
      required: true,
    },
    leaveStart: {
      type: String,
      required: true,
    },
    leaveEnd: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    subsitutionName: {
      type: String,
      required: true,
    },
    currentDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("leave", leaveSchema);
