"use strict";

let API_URL = "http://localhost:8080";

// =================== DATA ==================== //

const getAllData = async () => {
  const response = await fetch(`${API_URL}/Students`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  sortData(data);
  searchdata(data);
  dataRender(data);
};
getAllData();

//  ===================== RENDER DATA ===================== //
function dataRender(data = []) {
  data.forEach((e) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${e.id}</td>
            <td>${e.Name}</td>
            <td>${e.lastName}</td>
            <td>${e.Date}</td></td>
            <td>${e.mark}</td>
            <td>${e.mark >= 70 ? "Passed" : "Failed"}</td>
            <td><i class="btn px-3 editData" id="editData"  data-edit = "${
              e.id
            }">Edit</i></td>
            <td><i class="btn px-3 Deletedata"  id="deleteData" data-del = "${
              e.id
            }">Delete</i> </td>
        `;

    $(".wrapper").appendChild(tr);
    $(".countData").innerHTML = data.length;
  });
}

function postData() {
  const name = $("#Name").value.trim();
  const lastName = $("#LastName").value.trim();
  const mark = $("#Mark").value;
  const Date = $("#Date").value;

  fetch(`${API_URL}/Students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Name: name,
      lastName: lastName,
      mark: mark,
      Date: Date,
    }),
  });
}

$(".modalButton").addEventListener("click", (e) => {
  const name = $("#Name").value.trim();
  const lastName = $("#LastName").value.trim();
  const mark = $("#Mark").value;
  const Date = $("#Date").value;

  if (Name.length < 5 || lastName.length < 5 || mark.length == 0) {
    alert("fill");
  } else {
    postData();
  }
});

$(".wrapper").addEventListener("click", (e) => {
  if (e.target.classList.contains("Deletedata")) {
    const id = e.target.getAttribute("data-del");
    fetch(`${API_URL}/Students/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }
});

const StudentList = async function (id) {
  const response = await fetch(`${API_URL}/Students/${id}`);
  const { Name, lastName, mark, Date } = await response.json();

  return {
    Name,
    lastName,
    mark,
    Date,
  };
};

function hideEditDataModal() {
  $("#modallWindow").style.display = "none";
}

$(".wrapper").addEventListener("click", (e) => {
  if (e.target.classList.contains("editData")) {
    const id = e.target.getAttribute("data-edit");
    localStorage.setItem("editID", id);

    $("#modallWindow").style.display = "flex";
    $("#modallCard").style.transform = "translateY(7%)";

    let result = StudentList(id);

    result.then((data) => {
        $("#EditName").value = data.Name,
        $("#EditLastName").value = data.lastName;
        $("#EditMark").value = data.mark, 
        $("#EditDate").value = data.Date;
    });
  }
});
function editData() {
  const name = $("#EditName").value;
  const lastName = $("#EditLastName").value;
  const mark = $("#EditMark").value;
  const Date = $("#EditDate").value;
  const id = localStorage.getItem("editID");
  fetch(`${API_URL}/Students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Name: name,
      lastName: lastName,
      mark: mark,
      Date: Date,
    }),
  });
}

$(".savedata").addEventListener("click", () => {
  editData();
  setTimeout(() => {
    hideEditDataModal();
  }, 500);
});

$("#addNewMember").addEventListener("click", (e) => {
  e.preventDefault();
  $("#modalWindow").style.display = "flex";
  $("#modalCard").style.transform = "translateY(7%)";
});

function hideModal() {
  $("#modalWindow").style.display = "none";
}

$("#closeModalCard").addEventListener("click", (e) => {
  hideModal();
});

function searchdata(data = []) {
  data.forEach((e) => {
    $("#Search").addEventListener("keyup", (evt) => {
      $(".wrapper").innerHTML = "";
      $(".wrapper").innerHTML = `<span class="loader"></span>`;
      setTimeout((time) => {
        if (
          e.Name.toLowerCase().includes(
            evt.target.value.toLowerCase().trim()
          ) ||
          e.lastName
            .toLowerCase()
            .includes(evt.target.value.toLowerCase().trim())
        ) {
          $(".loader").classList.add("d-none");
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${e.id}</td>
            <td>${e.Name}</td>
            <td>${e.lastName}</td>
            <td>${e.Date}</td></td>
            <td>${e.mark}</td>
            <td>${e.mark >= 70 ? "Passed" : "Failed"}</td>
            <td><i class="btn px-3 editData" id="editData"  data-edit = "${
              e.id
            }">Edit</i></td>
            <td><i class="btn px-3 " id="deleteData" data-del = "${
              e.id
            }">Delete</i></td>
        `;

          $(".wrapper").appendChild(tr);
          $(".countData").innerHTML = data.length;
        }
      }, "800 ");
    });
  });
}

const sortedMarks = [];
const sortedData = [];
function sortData(data = []) {
  data.forEach((e) => {
    sortedMarks.push(e.mark);
    sortedData.push(e);
  });
  console.log(sortedData);

  $("#ratemark").addEventListener("change", (evt) => {
    $(".wrapper").innerHTML = "";
    if (evt.target.value == "ToHighest") {
      let order = [0, 100];
      let toHighestData = sortedData.sort((a, b) => a.mark - b.mark);

      toHighestData.forEach((e) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.id}</td>
            <td>${e.Name}</td>
            <td>${e.lastName}</td>
            <td>${e.Date}</td></td>
            <td>${e.mark}</td>
            <td>${e.mark >= 70 ? "Passed" : "Failed"}</td>
            <td><i class="btn px-3 editData" id="editData"  data-edit = "${
              e.id
            }">Edit</i></td>
            <td><i class="btn px-3" id="deleteData" data-del = "${
              e.id
            }">Delete</i></td>
        `;

        $(".wrapper").appendChild(tr);
      });
    } else if (evt.target.value == "ToLowest") {
      let order = [0, 100];
      let ToLowestData = sortedData.sort((a, b) => b.mark - a.mark);

      ToLowestData.forEach((e) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.id}</td>
            <td>${e.Name}</td>
            <td>${e.lastName}</td>
            <td>${e.Date}</td></td>
            <td>${e.mark}</td>
            <td>${e.mark >= 70 ? "Passed" : "Failed"}</td>
            <td><i class="btn px-3 editData" id="editData"  data-edit = "${
              e.id
            }">Edit</i></td>
            <td><i class="btn px-3" id="deleteData" data-del = "${
              e.id
            }">Delete</i></td>
        `;

        $(".wrapper").appendChild(tr);
      });
    }
  });
}
