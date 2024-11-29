// زر ال scroll في اول صفحة
function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
  
  var editingSiteId = null;
  
  // علشان اعمل validation لاسم الموقع مستخدمتش ال Regex هنا علشان علشان ملهوش شروط كتير
  document.getElementById("siteName").addEventListener("input", function () {
    var siteName = this.value.trim();
    var siteNameError = document.getElementById("siteNameError");
    if (siteName.length < 3) {
      siteNameError.textContent =
        "The site name must be at least 3 characters long.";
      siteNameError.style.display = "block";
    } else if (siteName.length > 50) {
      siteNameError.textContent = "The site name must be 50 characters or less.";
      siteNameError.style.display = "block";
    } else {
      siteNameError.style.display = "none";
    }
  });
  
  // علشان اعمل validation لل URL
  document.getElementById("siteURL").addEventListener("input", function () {
    var siteURL = this.value.trim();
    var siteURLError = document.getElementById("siteURLError");
    var urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (siteURL === "") {
      siteURLError.textContent = "Please enter the website URL.";
      siteURLError.style.display = "block";
    } else if (!urlPattern.test(siteURL)) {
      siteURLError.textContent =
        'URL must enter like "https://example.com" or "www.example.com" or "http://example.com/example/..."';
      siteURLError.style.display = "block";
    } else {
      siteURLError.style.display = "none";
    }
  });
  
  // لعرض الاخطاء وال rules من مكتبة sweetalert
  document.getElementById("siteForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    var siteName = document.getElementById("siteName").value.trim();
    var siteURL = document.getElementById("siteURL").value.trim();
    var siteNameError = document.getElementById("siteNameError");
    var siteURLError = document.getElementById("siteURLError");
  
    // عند الضغط والمعلومات فارغة
    if (siteName === "" || siteURL === "") {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Please fill in all fields.",
      });
      return;
    }
  
    // عند ادخال اسم موقع خطا
    if (
      siteName.length < 3 ||
      siteName.length > 50 ||
      siteNameError.style.display === "block" ||
      siteURLError.style.display === "block"
    ) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "Please correct the errors below input.",
      });
      return;
    }
  
    var sites = JSON.parse(localStorage.getItem("sites")) || [];
    var siteExists = false;
    for (var i = 0; i < sites.length; i++) {
      if (sites[i].name === siteName && sites[i].id !== editingSiteId) {
        siteExists = true;
        break;
      }
    }
  
    // عند ادخال اسم موقع متكرر
    if (siteExists) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: "The site name already exists. Please choose another name.",
      });
      return;
    }
  
    if (editingSiteId !== null) {
      // لتحديث الموقع
      var updatedSites = [];
      for (var i = 0; i < sites.length; i++) {
        var site = sites[i];
        if (site.id === editingSiteId) {
          var updatedSite = {};
          for (var key in site) {
            if (site.hasOwnProperty(key)) {
              updatedSite[key] = site[key];
            }
          }
          updatedSite.name = siteName;
          updatedSite.url = siteURL;
          updatedSites.push(updatedSite);
        } else {
          updatedSites.push(site);
        }
      }
      localStorage.setItem("sites", JSON.stringify(updatedSites));
      editingSiteId = null;
      document.getElementById("submitButton").textContent = "Submit";
      document
        .getElementById("submitButton")
        .classList.remove("btn-outline-warning");
      document
        .getElementById("submitButton")
        .classList.add("btn-outline-success");
    } else {
      // لاضافة موقع جديد
      sites.push({ id: sites.length + 1, name: siteName, url: siteURL });
      localStorage.setItem("sites", JSON.stringify(sites));
    }
  
    // علشان احدث الجدول بالموقع المضاف جديد
    displaySites();
  
    // علشان افضي ال form بعد ما اضيف الموقع
    document.getElementById("siteName").value = "";
    document.getElementById("siteURL").value = "";
  
    // علشان اعمل scroll لمكان الجدول
    document
      .getElementById("displaySection")
      .scrollIntoView({ behavior: "smooth" });
  });
  
 // عرض المواقع في الجدول
function displaySites() {
    var sites = JSON.parse(localStorage.getItem("sites")) || [];
    var tableBody = document.getElementById("sitesTableBody");
    tableBody.innerHTML = ""; // علشان افضي الجدول قبل ما اضيف موقع جديد
  
    var rowsHTML = "";
    for (var i = 0; i < sites.length; i++) {
      var site = sites[i];
      rowsHTML += `
        <tr>
          <td>${site.id}</td>
          <td>${site.name}</td>
          <td><button class="btn btn-success" onclick="openSite('${site.url}')"><i class="fa-regular fa-eye fa-beat-fade"></i> Visit</button></td>
          <td><button class="btn btn-outline-warning" onclick="editSite(${site.id}, '${site.name}', '${site.url}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button></td>
          <td><button class="btn btn-outline-danger" onclick="deleteSite(${site.id})"><i class="fa-solid fa-trash"></i> Delete</button></td>
        </tr>
      `;
    }
    tableBody.innerHTML = rowsHTML;
  }
  
  
  // فتح الموقع في صفحة اخري
  function openSite(url) {
    window.open(url, "_blank");
  }
  
  // لتعديل موقع من الجدول مش مطلوبة بس عملتها
  function editSite(id, name, url) {
    document.getElementById("siteName").value = name;
    document.getElementById("siteURL").value = url;
    editingSiteId = id;
    document.getElementById("submitButton").textContent = "Edit ";
    document
      .getElementById("submitButton")
      .classList.remove("btn-outline-success");
    document.getElementById("submitButton").classList.add("btn-outline-warning");
    document
      .getElementById("inputSection")
      .scrollIntoView({ behavior: "smooth" });
  }
  
  // لحذف موقع من الجدول
  function deleteSite(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this site !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes، Delete!",
      cancelButtonText: "cancellation",
    }).then(function (result) {
      if (result.isConfirmed) {
        var sites = JSON.parse(localStorage.getItem("sites")) || [];
        var updatedSites = [];
        for (var i = 0; i < sites.length; i++) {
          if (sites[i].id !== id) {
            updatedSites.push(sites[i]);
          }
        }
        localStorage.setItem("sites", JSON.stringify(updatedSites));
        displaySites();
        Swal.fire("Deleted!", "The site has been deleted.", "success");
      }
    });
  }
  
  // لمنع حذف المواقع لما اعمل reload
  document.addEventListener("DOMContentLoaded", displaySites);
  