


var array = [
  {
    id: "1",
    name: "neha",
    country: "india",
    city: "mumbai",
  },
  {
    id: "2",
    name: "rashi",
    country: "usa",
    city: "morena",
  },

  {
    id: "3",
    name: "Mona",
    country: "ukrain",
    city: "gwalior",
  },
  {
    id: "4",
    name: "rupesh",
    country: "india",
    city: "sangali",
  },
  {
    id: "5",
    name: "rounit",
    country: "pakistan",
    city: "pune",
  },
  {
    id: "6",
    name: "richa",
    country: "indoneshia",
    city: "chennai",
  },
  {
    id: "7",
    name: "raman",
    country: "bangladesh",
    city: "delhi",
  },
  {
    id: "8",
    name: "ram",
    country: "australia",
    city: "kolkata",
  },
];
const data = fetch("http://localhost:3000/clg").then(response => {
  return response.data;
});
console.log(data)
function showtable(curarray) {
  document.getElementById("mytable").innerHTML = `
   <tr class="bg-primary text-white fw-bold">
   <td>Id</td>
   <td>Name</td>
   <td>Country</td>
   <td>City</td>

  </tr>`;

  if (curarray == "") {
    document.getElementById("error").innerHTML = `
    <span class="text-danger">Not found!</span>`;
  } else {
    document.getElementById("error").innerHTML = "";
    for (var i = 0; i < curarray.length; i++) {
      document.getElementById("mytable").innerHTML += `
        <tr>
        <td>${curarray[i].id}</td>
        <td>${curarray[i].name}</td>
        <td>${curarray[i].country}</td>
        <td>${curarray[i].city}</td>
        </tr>
        `;
    }
  }
}


var newarray = [];

document.getElementById("search").addEventListener("change", function () {
      

  var search = this.value.toLowerCase();
  console.log(search);
  //  axios.get("/getData").then((response) => {
  //    var clutter = "";
  //    console.log(response);
  //    showtable(response.data.inq);
  //  });
  newarray = response.data.inq.filter(function (val) {
    if (
      val.id.includes(search) ||
      val.name.includes(search) ||
      val.country.includes(search) ||
      val.city.includes(search)
    ) {
      var newobj = {
        id: val.id,
        name: val.name,
        country: val.country,
        city: val.city,
      };
      return newobj;
    }
  });
  showtable(newarray);
});
