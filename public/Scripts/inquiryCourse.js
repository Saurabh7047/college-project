const courses = [
  "BTech","MTech","MCA","MBA","BCA","BBA"
];

const branches = {
  "BTech":["CSE","CSE-AIML","CSE-CyberSecurity","CS-DS","CSE-IOT","IT","ECE","ME","CE"],
  "MTech":["CSE","VLSI"],
 
};



const courseSelect = document.querySelector('#select-course');
console.log(courseSelect);


const branchSelect = document.querySelector('#select-branch');
console.log(branchSelect);

const branchLabel = document.querySelector("#branchLabel")


courses.forEach(course => {
  const option = document.createElement('option');
  option.value = course;
  option.textContent = course;
  courseSelect.appendChild(option);
});



courseSelect.addEventListener('change', function() { 
      if(this.value == "BTech" || this.value == "MTech"){
        branchSelect.style.display = 'block'
        branchLabel.style.display = 'block'
        branchSelect.setAttribute('name','branch')
        const seletedBranch = this.value;
        const branchList = branches[seletedBranch] || [];
        populateCourseDropdown(branchList);
   
    
      }else{
        branchSelect.removeAttribute('name')
        branchSelect.style.display = 'none'
        branchLabel.style.display = 'none'
      }
      function populateCourseDropdown(branchList) {
        branchSelect.innerHTML = '<option value="">Select </option>';
        branchList.forEach((elem)=>{
          const option = document.createElement('option');
          option.value = elem;
          option.textContent = elem;
          branchSelect.appendChild(option);
        })
      }
      
    
})
