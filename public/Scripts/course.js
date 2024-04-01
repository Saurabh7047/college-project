const courses = ["BTech", "MTech", "MCA", "MBA", "BCA", "BBA"];

const branches = {
  BTech: [
    "CSE",
    "CSE-AIML",
    "CSE-CyberSecurity",
    "CS-DS",
    "CSE-IOT",
    "IT",
    "ECE",
    "ME",
    "CE",
  ],
  MTech: ["CSE", "VLSI"],
};

const courseSelect = document.querySelector("#select-course");

const branchSelect = document.querySelectorAll(".select-branch");
console.log(branchSelect);

const branchSelect1 = document.querySelector("#select-branch1");

const branchSelect2 = document.querySelector("#select-branch2");

const branchSelect3 = document.querySelector("#select-branch3");

const branchLabel1 = document.querySelector("#branchLabel1");

const branchLabel2 = document.querySelector("#branchLabel2");

const branchLabel3 = document.querySelector("#branchLabel3");

courses.forEach((course) => {
  const option = document.createElement("option");
  option.value = course;
  option.textContent = course;
  courseSelect.appendChild(option);
});

courseSelect.addEventListener("change", function () {
  branchSelect1.removeAttribute("name");
  branchSelect2.removeAttribute("name");
  branchSelect3.removeAttribute("name");

  if (this.value == "MTech") {
    branchSelect1.style.display = "block";
    branchSelect2.style.display = "none";
    branchSelect3.style.display = "none";
    branchLabel2.style.display = "none";
    branchLabel3.style.display = "none";
    branchLabel1.style.display = "block";
    branchSelect1.setAttribute("name", "branch");
    const seletedBranch = this.value;
    const branchList = branches[seletedBranch] || [];
    populateCourseDropdown(branchList);
  } else if (this.value == "BTech") {
    branchSelect1.style.display = "block";
    branchSelect2.style.display = "block";
    branchSelect3.style.display = "block";
    branchLabel1.style.display = "block";
    branchLabel2.style.display = "block";
    branchLabel3.style.display = "block";
    branchSelect.forEach((branch) => {
      branch.setAttribute("name", "branch");
    });
    const seletedBranch = this.value;
    const branchList = branches[seletedBranch] || [];
    populateCourseDropdown(branchList);
  } else {
    branchSelect1.style.display = "none";
    branchSelect2.style.display = "none";
    branchSelect3.style.display = "none";
    branchLabel2.style.display = "none";
    branchLabel3.style.display = "none";
    branchLabel1.style.display = "none";
  }

  function populateCourseDropdown(branchList) {
    branchSelect.forEach((elem) => {
      if (elem.style.display == "block") {
        console.log(elem);
        elem.innerHTML = '<option value="">Select </option>';
        branchList.forEach((branch) => {
          const option = document.createElement("option");
          option.value = branch;
          option.textContent = branch;
          elem.appendChild(option);
        });
      }
    });
  }
});
