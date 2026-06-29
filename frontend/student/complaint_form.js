// ====================================================
// COMPLAINT FORM — Single Page, Frontend Only
// ====================================================

var MAX_FILE_SIZE  = 50 * 1024;
var MAX_FILES      = 5;
var selectedFiles  = [];
var selectedPriority = "medium";
var submittedId    = "";

// ====================================================
// INIT
// ====================================================
document.addEventListener("DOMContentLoaded", function () {
    readURLParams();
    fillStudentFromStorage();
    attachCharCounter();
    generateSampleId();
});

// ====================================================
// READ URL PARAMS
// ====================================================
function readURLParams() {
    var p         = new URLSearchParams(window.location.search);
    var dept      = p.get("dept")      || "";
    var category  = p.get("category")  || "";
    var emergency = p.get("emergency") === "true";
    var desc      = p.get("desc")      || "";

    document.getElementById("f_dept").value      = dept;
    document.getElementById("f_category").value  = category;
    document.getElementById("f_emergency").value = String(emergency);

    document.getElementById("display_dept").textContent     = dept     || "Not specified";
    document.getElementById("display_category").textContent = category || "Not specified";

    var emEl = document.getElementById("display_emergency");
    if (emergency) {
        emEl.textContent      = "YES — Emergency";
        emEl.style.color      = "#dc2626";
        emEl.style.fontWeight = "700";
    } else {
        emEl.textContent      = "No";
        emEl.style.color      = "#059669";
        emEl.style.fontWeight = "600";
    }

    document.getElementById("pageTitle").textContent    = category ? "Report: " + category : "Submit Complaint";
    document.getElementById("pageSubtitle").textContent = dept     ? "Department: " + dept  : "Fill in all required details below";

    setHeaderIcon(dept, emergency);

    if (emergency) {
        document.getElementById("emergencyBanner").classList.add("show");
        document.getElementById("f_emergencyToggle").checked = true;
        setPriority("high");
    }

    if (desc) {
        document.getElementById("f_description").placeholder = desc + "\n\nAdd more specific details here...";
    }

    if (category === "Other Complaints" || category === "Other") {
        document.getElementById("otherSection").classList.add("show");
    }
}

// ====================================================
// SET HEADER ICON
// ====================================================
function setHeaderIcon(dept, emergency) {
    var map = {
        "Electrical":       "fa-bolt",
        "Water & Plumbing": "fa-tint",
        "IT Support":       "fa-wifi",
        "Infrastructure":   "fa-building",
        "Security":         "fa-shield-alt",
        "Library":          "fa-book",
        "Transport":        "fa-bus",
        "Canteen":          "fa-utensils",
        "Housekeeping":     "fa-broom",
        "Medical":          "fa-medkit",
        "Administration":   "fa-file-alt",
        "Other":            "fa-question-circle"
    };
    var icon = emergency ? "fa-exclamation-triangle" : (map[dept] || "fa-paper-plane");
    document.getElementById("pageHeaderIcon").innerHTML = "<i class='fa " + icon + "'></i>";
}

// ====================================================
// FILL STUDENT FROM LOCALSTORAGE
// ====================================================
function fillStudentFromStorage() {
    var name  = localStorage.getItem("studentName")  || "";
    var sid   = localStorage.getItem("studentId")    || "";
    var dept  = localStorage.getItem("studentDept")  || "";
    var email = localStorage.getItem("studentEmail") || "";

    var el;
    el = document.getElementById("f_name");      if (el && name)  el.value = name;
    el = document.getElementById("f_studentId"); if (el && sid)   el.value = sid;
    el = document.getElementById("f_studentDept"); if (el && dept) el.value = dept;
    el = document.getElementById("f_email");     if (el && email) el.value = email;

    document.getElementById("topStudentName").textContent = name || "Student";
    document.getElementById("topStudentId").textContent   = sid  || "";
}

// ====================================================
// OTHER CATEGORY CHANGED
// ====================================================
function otherCategoryChanged() {
    var val       = document.getElementById("f_otherCategory").value;
    var customBox = document.getElementById("customCatBox");
    if (val === "__custom__") {
        customBox.classList.add("show");
        document.getElementById("f_customCategory").focus();
    } else {
        customBox.classList.remove("show");
        document.getElementById("f_customCategory").value = "";
    }
}

// ====================================================
// GET FINAL CATEGORY
// ====================================================
function getFinalCategory() {
    var base = document.getElementById("f_category").value;
    if (base !== "Other Complaints" && base !== "Other") return base;
    var sel    = document.getElementById("f_otherCategory").value;
    var custom = document.getElementById("f_customCategory") ? document.getElementById("f_customCategory").value.trim() : "";
    if (!sel)                 return "Other";
    if (sel === "__custom__") return custom || "Other";
    return sel;
}

// ====================================================
// PRIORITY
// ====================================================
function setPriority(val) {
    selectedPriority = val;
    document.getElementById("f_priority").value = val;
    document.querySelectorAll(".priority-card").forEach(function (card) {
        card.classList.toggle("selected", card.dataset.val === val);
    });
}

// ====================================================
// EMERGENCY TOGGLE
// ====================================================
function emergencyToggleChanged() {
    var on     = document.getElementById("f_emergencyToggle").checked;
    var banner = document.getElementById("emergencyBanner");
    var emEl   = document.getElementById("display_emergency");

    document.getElementById("f_emergency").value = String(on);

    if (on) {
        banner.classList.add("show");
        setPriority("high");
        emEl.textContent      = "YES — Emergency";
        emEl.style.color      = "#dc2626";
        emEl.style.fontWeight = "700";
    } else {
        banner.classList.remove("show");
        emEl.textContent      = "No";
        emEl.style.color      = "#059669";
        emEl.style.fontWeight = "600";
    }
}

// ====================================================
// CHARACTER COUNTER
// ====================================================
function attachCharCounter() {
    var ta = document.getElementById("f_description");
    var cc = document.getElementById("charCount");
    if (!ta || !cc) return;
    ta.addEventListener("input", function () {
        var len = this.value.length;
        cc.textContent = len + " / 500";
        cc.className   = "char-count";
        if (len > 400) cc.classList.add("warn");
        if (len > 500) cc.classList.add("over");
    });
}

// ====================================================
// GENERATE SAMPLE ID
// ====================================================
function generateSampleId() {
    var yr  = new Date().getFullYear();
    var num = String(Math.floor(Math.random() * 900) + 100);
    var el  = document.getElementById("sampleId");
    if (el) el.textContent = "CP" + yr + "-" + num;
}

// ====================================================
// VALIDATE ENTIRE FORM AT ONCE
// ====================================================
function validateForm() {
    clearErrors();

    var category = document.getElementById("f_category").value;
    var isOther  = (category === "Other Complaints" || category === "Other");

    if (isOther) {
        var otherSel = document.getElementById("f_otherCategory").value;
        if (!otherSel) {
            markErr("f_otherCategory", "Please select a complaint category from the list");
            showFormAlert("Please select a complaint category from the Other section.");
            scrollToEl("f_otherCategory");
            return false;
        }
        if (otherSel === "__custom__") {
            var customEl = document.getElementById("f_customCategory");
            if (!customEl || !customEl.value.trim()) {
                markErr("f_customCategory", "Please enter your complaint title");
                showFormAlert("Please enter your complaint title.");
                scrollToEl("f_customCategory");
                return false;
            }
        }
    }

    var loc = document.getElementById("f_location").value.trim();
    if (!loc) {
        markErr("f_location", "Please enter the exact location");
        showFormAlert("Location is required. Please enter where the problem is.");
        scrollToEl("f_location");
        return false;
    }

    var desc = document.getElementById("f_description").value.trim();
    if (!desc) {
        markErr("f_description", "Please describe the problem");
        showFormAlert("Please describe the problem before submitting.");
        scrollToEl("f_description");
        return false;
    }
    if (desc.length < 20) {
        markErr("f_description", "Too short — minimum 20 characters required");
        showFormAlert("Description too short. Please write at least 20 characters.");
        scrollToEl("f_description");
        return false;
    }
    if (desc.length > 500) {
        markErr("f_description", "Too long — maximum 500 characters allowed");
        showFormAlert("Description exceeds 500 characters. Please shorten it.");
        scrollToEl("f_description");
        return false;
    }

    var name = document.getElementById("f_name").value.trim();
    if (!name) {
        markErr("f_name", "Please enter your full name");
        showFormAlert("Please enter your full name.");
        scrollToEl("f_name");
        return false;
    }

    var contact = document.getElementById("f_contact").value.trim();
    if (!contact) {
        markErr("f_contact", "Contact number is required");
        showFormAlert("Please enter your 10-digit contact number.");
        scrollToEl("f_contact");
        return false;
    }
    if (contact.length !== 10 || isNaN(Number(contact))) {
        markErr("f_contact", "Must be exactly 10 digits");
        showFormAlert("Please enter a valid 10-digit contact number.");
        scrollToEl("f_contact");
        return false;
    }

    var dept = document.getElementById("f_studentDept").value.trim();
    if (!dept) {
        markErr("f_studentDept", "Please enter your department");
        showFormAlert("Please enter your department / branch.");
        scrollToEl("f_studentDept");
        return false;
    }

    return true;
}

// ====================================================
// HELPERS
// ====================================================
function markErr(fieldId, message) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    el.classList.add("err");
    var existing = el.parentNode.querySelector(".err-msg");
    if (existing) existing.remove();
    var span       = document.createElement("span");
    span.className = "err-msg";
    span.textContent = "⚠ " + message;
    el.parentNode.appendChild(span);
}

function clearErrors() {
    document.querySelectorAll(".err").forEach(function (el) { el.classList.remove("err"); });
    document.querySelectorAll(".err-msg").forEach(function (el) { el.remove(); });
    hideFormAlert();
}

function showFormAlert(msg) {
    var box  = document.getElementById("formAlert");
    var text = document.getElementById("formAlertText");
    if (!box || !text) return;
    text.textContent = msg;
    box.classList.add("show");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(function () { box.classList.remove("show"); }, 5000);
}

function hideFormAlert() {
    var box = document.getElementById("formAlert");
    if (box) box.classList.remove("show");
}

function scrollToEl(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ====================================================
// FILE HANDLING
// ====================================================
function onFileSelect(input) {
    processFiles(Array.from(input.files));
    input.value = "";
}

function onDragOver(e) {
    e.preventDefault();
    document.getElementById("dropZone").classList.add("drag-over");
}

function onDragLeave() {
    document.getElementById("dropZone").classList.remove("drag-over");
}

function onDrop(e) {
    e.preventDefault();
    document.getElementById("dropZone").classList.remove("drag-over");
    processFiles(Array.from(e.dataTransfer.files));
}

function processFiles(files) {
    var errBox  = document.getElementById("sizeError");
    var errText = document.getElementById("sizeErrorText");
    var rejected = [];
    var tooMany  = [];

    files.forEach(function (file) {
        if (selectedFiles.length >= MAX_FILES) { tooMany.push(file.name); return; }
        var allowed = ["image/jpeg","image/png","image/gif","video/mp4"];
        if (!allowed.includes(file.type)) { rejected.push(file.name + " (wrong type)"); return; }
        if (file.size > MAX_FILE_SIZE) { rejected.push(file.name + " (" + fmtSize(file.size) + " — over 50KB)"); return; }
        var dup = selectedFiles.some(function (f) { return f.name === file.name && f.size === file.size; });
        if (dup) return;
        selectedFiles.push(file);
        renderThumb(file, selectedFiles.length - 1);
    });

    var msgs = [];
    if (rejected.length) msgs.push("Rejected: " + rejected.join(", "));
    if (tooMany.length)  msgs.push("Max " + MAX_FILES + " files allowed.");

    if (msgs.length) { errText.textContent = msgs.join(" — "); errBox.classList.add("show"); }
    else { errBox.classList.remove("show"); }

    updateSummary();
}

function renderThumb(file, index) {
    var isVideo = file.type.startsWith("video/");
    var reader  = new FileReader();
    var grid    = document.getElementById("previewGrid");
    reader.onload = function (e) {
        var div       = document.createElement("div");
        div.className = "preview-thumb";
        div.id        = "thumb-" + index;
        var media     = isVideo
            ? "<video src='" + e.target.result + "' muted></video>"
            : "<img src='" + e.target.result + "' alt='preview'>";
        div.innerHTML = media
            + "<button class='remove-btn' onclick='removeFile(" + index + ")'>&#x2715;</button>"
            + "<span class='size-label'>" + fmtSize(file.size) + "</span>"
            + "<span class='type-badge'>" + (isVideo ? "VID" : "IMG") + "</span>";
        grid.appendChild(div);
    };
    reader.readAsDataURL(file);
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    document.getElementById("previewGrid").innerHTML = "";
    var temp = selectedFiles.slice();
    selectedFiles = [];
    temp.forEach(function (f) { selectedFiles.push(f); renderThumb(f, selectedFiles.length - 1); });
    document.getElementById("sizeError").classList.remove("show");
    updateSummary();
}

function updateSummary() {
    var box  = document.getElementById("fileSummary");
    var text = document.getElementById("fileSummaryText");
    if (selectedFiles.length > 0) {
        var total = selectedFiles.reduce(function (a, f) { return a + f.size; }, 0);
        text.textContent = selectedFiles.length + " file(s) — " + fmtSize(total) + " total";
        box.classList.add("show");
    } else {
        box.classList.remove("show");
    }
}

function fmtSize(bytes) {
    if (bytes < 1024) return bytes + "B";
    return (bytes / 1024).toFixed(1) + "KB";
}

// ====================================================
// SUBMIT
// ====================================================
function submitComplaint() {
    if (!validateForm()) return;

    var data = {
        complaint_id: "CP" + new Date().getFullYear() + "-" + Math.floor(Math.random()*1000),
        name: document.getElementById("f_name").value,
        student_id: document.getElementById("f_studentId").value,
        department: document.getElementById("f_studentDept").value,
        contact: document.getElementById("f_contact").value,
        email: document.getElementById("f_email").value,
        location: document.getElementById("f_location").value,
        description: document.getElementById("f_description").value,
        category: getFinalCategory(),
        priority: document.getElementById("f_priority").value
    };

    fetch("http://localhost/CAMPUS-PROBLEM-REPORTER/backend/submit_complaint.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
})
.then(res => res.json())
.then(res => {
    console.log(res); // ✅ DEBUG

    if(res.status === "success"){
        submittedId = data.complaint_id;
        showSuccess();
    } else {
        alert("Error: " + res.message);
    }
})
.catch(err => {
    console.error(err);
    alert("Server error");
});
}


// ====================================================
// SUBMIT ANOTHER
// ====================================================
function submitAnother() { window.location.reload(); }