const degrees = ["12th", "BTech", "PG"];

const Authority = {
  "12th": ["CBSE", "ICSE", "MP Board"],
};

const stream = {
  "12th": ["PCM", "PCMB", "PCB"],
  BTech: ["CS", "EC", "ME", "CE", "IT", "Chem"],
  PG: ["none"],
};

const degreeSelect = document.querySelector("#select-degree");

const authoritySelect = document.getElementById("select-authority");

const streamSelect = document.querySelector("#select-stream");

const collegeName = document.querySelector("#collegeName");

const collegeLabel = document.querySelector("#collegeLabel");

const authorityLabel = document.querySelector("#authorityLabel");
degrees.forEach((degree) => {
  const option = document.createElement("option");
  option.value = degree;
  option.textContent = degree;
  degreeSelect.appendChild(option);
});

degreeSelect.addEventListener("change", function () {
  if (this.value == "12th") {
    collegeName.style.display = "none";
    collegeLabel.style.display = "none";
    collegeName.removeAttribute("name");
    authoritySelect.style.display = "block";
    authorityLabel.style.display = "block";
    authoritySelect.setAttribute("name", "schoolName");
    const selectedDegree = this.value;
    const degreeList = Authority[selectedDegree] || [];
    populateDegreeDropdown(degreeList);
  } else {
    authoritySelect.style.display = "none";
    authorityLabel.style.display = "none";
    collegeName.style.display = "block";
    collegeLabel.style.display = "block";
    collegeName.setAttribute("name", "schoolName");
    authoritySelect.removeAttribute("name");
  }

  console.log(authoritySelect.getAttribute(name));
  console.log(collegeName.getAttribute(name));

  function populateDegreeDropdown(degreeList) {
    authoritySelect.innerHTML = '<option value="">Select </option>';

    degreeList.forEach((elem) => {
      const option = document.createElement("option");
      option.value = elem;
      option.textContent = elem;
      authoritySelect.appendChild(option);
    });
  }
});

degreeSelect.addEventListener("change", function () {
  const selectedDegree = this.value;
  const streamList = stream[selectedDegree] || [];
  populateStreamDropdown(streamList);

  function populateStreamDropdown(streamList) {
    streamSelect.innerHTML = '<option value="">Select </option>';

    streamList.forEach((elem) => {
      const option = document.createElement("option");
      option.value = elem;
      option.textContent = elem;
      streamSelect.appendChild(option);
    });
  }
});
