// ====================================================
// STUDENT DASHBOARD — student-dashboard.js
// 100% Backend Driven — No mock/dummy data
// All data fetched from live API
// ====================================================
if(localStorage.getItem("isLoggedIn") !== "true"){
    window.location.href = "../loginpages/student-login.html";
}

history.pushState(null, null, location.href);

window.onpopstate = function () {
    history.go(1);
};


const API_BASE = "http://localhost:5000/api";

function getToken()    { return localStorage.getItem("studentToken") || ""; }
function getStudentId(){ return localStorage.getItem("studentId")    || ""; }

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}

// ====================================================
// INIT
// ====================================================
document.addEventListener("DOMContentLoaded", function () {
    guardLogin();
    loadStudentProfile();
    loadComplaints();
    loadMessages();
    loadNotifications();
    initStarRating();
    attachSearchEnter();
    startPolling();
});

// ====================================================
// GUARD — redirect to login if not authenticated
// ====================================================
function guardLogin() {
    if (!getToken() || !getStudentId()) {
        window.location.href = "student-login.html";
    }
}

// ====================================================
// LOAD STUDENT PROFILE
// ====================================================
async function loadStudentProfile() {
    try {
        const res = await fetch(API_BASE + "/students/" + getStudentId(), {
            headers: authHeaders()
        });

        if (res.status === 401) {
            localStorage.clear();
            window.location.href = "student-login.html";
            return;
        }

        if (!res.ok) throw new Error("HTTP " + res.status);
        studentProfile = await res.json();
        renderProfile();

    } catch (err) {
        // Fallback to localStorage values
        studentProfile = {
            id:         getStudentId(),
            name:       localStorage.getItem("studentName")  || "Student",
            department: localStorage.getItem("studentDept")  || "—",
            email:      localStorage.getItem("studentEmail") || "—",
            contact:    "—",
            semester:   "—"
        };
        renderProfile();
        console.error("loadStudentProfile:", err);
    }
}

// ====================================================
// RENDER PROFILE
// ====================================================
function renderProfile() {
    const s = studentProfile;

    // Header greeting
    document.getElementById("studentName").textContent =
        (s.name || "Student").split(" ")[0];

    // Profile section fields
    setTxt("profileAvatar", (s.name || "S").charAt(0).toUpperCase());
    setTxt("pName",         s.name       || "—");
    setTxt("pId",           s.id         || "—");
    setTxt("pDept",         s.department || "—");
    setTxt("pContact",      s.contact    || "—");
    setTxt("pEmail",        s.email      || "—");
    setTxt("pSemester",     s.semester   || "—");

    // Pre-fill edit form
    setVal("editName",     s.name);
    setVal("editDept",     s.department);
    setVal("editContact",  s.contact);
    setVal("editEmail",    s.email);

    const semSel = document.getElementById("editSemester");
    if (semSel && s.semester) {
        for (let i = 0; i < semSel.options.length; i++) {
            if (semSel.options[i].value === s.semester) {
                semSel.selectedIndex = i;
                break;
            }
        }
    }
}

// ====================================================
// LOAD ALL COMPLAINTS
// ====================================================
async function loadComplaints() {
    showTableLoading();
    try {
        const res = await fetch(
            API_BASE + "/complaints?studentId=" + getStudentId(),
            { headers: authHeaders() }
        );
        if (!res.ok) throw new Error("HTTP " + res.status);
        allComplaints = await res.json();

        renderComplaintsTable(allComplaints);
        updateStats();
        renderSummaryBars();

    } catch (err) {
        showTableError("Could not load complaints.");
        console.error("loadComplaints:", err);
    }
}

// ====================================================
// RENDER COMPLAINTS TABLE
// ====================================================
function renderComplaintsTable(data) {
    const start     = (currentPage - 1) * PER_PAGE;
    const paginated = data.slice(start, start + PER_PAGE);
    const tbody     = document.getElementById("complaintsBody");
    tbody.innerHTML = "";

    if (paginated.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;color:#9ca3af;padding:40px;font-size:14px">
                    <i class="fa fa-inbox"
                       style="font-size:28px;display:block;margin-bottom:8px;opacity:0.3"></i>
                    No complaints filed yet.
                    <a onclick="openModal('submitComplaintModal')"
                       style="color:#0ea5a4;cursor:pointer;margin-left:6px">
                        Report your first issue
                    </a>
                </td>
            </tr>`;
        renderPagination(0);
        return;
    }

    paginated.forEach(function (c) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <strong style="color:#0f172a">${c.id}</strong>
                ${c.isEmergency
                    ? '<br><span style="color:#ef4444;font-size:10px">🚨 EMERGENCY</span>'
                    : ""}
            </td>
            <td>${c.department}</td>
            <td>${c.category}</td>
            <td>${formatDate(c.date)}</td>
            <td>
                <span class="priority-${c.priority}">
                    ${c.priority.toUpperCase()}
                </span>
            </td>
            <td>
                <span class="badge-s badge-${c.status}">${c.status}</span>
            </td>
            <td>
                ${c.helper
                    ? `<span style="color:#059669;font-weight:600;font-size:12px">
                           <i class="fa fa-user-check"></i> ${c.helper}
                       </span>`
                    : `<span style="color:#9ca3af;font-size:12px">Not assigned</span>`}
            </td>
            <td>
                <button class="btn-view-s"
                        onclick="viewComplaint('${c.id}')">
                    <i class="fa fa-eye"></i> View
                </button>
            </td>`;
        tbody.appendChild(row);
    });

    renderPagination(data.length);
}

// ====================================================
// PAGINATION
// ====================================================
function renderPagination(total) {
    const pages     = Math.ceil(total / PER_PAGE) || 1;
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    for (let i = 1; i <= pages; i++) {
        const btn     = document.createElement("button");
        btn.className   = "page-btn" + (i === currentPage ? " active" : "");
        btn.textContent = i;
        btn.onclick     = function () { currentPage = i; applyFilters(); };
        container.appendChild(btn);
    }
}

// ====================================================
// UPDATE STATS
// ====================================================
function updateStats() {
    document.getElementById("totalCount").textContent =
        allComplaints.length;
    document.getElementById("pendingCount").textContent =
        allComplaints.filter(function (c) { return c.status === "pending"; }).length;
    document.getElementById("inprogressCount").textContent =
        allComplaints.filter(function (c) { return c.status === "in-progress"; }).length;
    document.getElementById("resolvedCount").textContent =
        allComplaints.filter(function (c) { return c.status === "completed"; }).length;
}

// ====================================================
// SUMMARY BARS (profile section)
// ====================================================
function renderSummaryBars() {
    const total     = allComplaints.length || 1;
    const pending   = allComplaints.filter(function (c) { return c.status === "pending"; }).length;
    const progress  = allComplaints.filter(function (c) { return c.status === "in-progress"; }).length;
    const completed = allComplaints.filter(function (c) { return c.status === "completed"; }).length;
    const rejected  = allComplaints.filter(function (c) { return c.status === "rejected"; }).length;

    const container = document.getElementById("summaryBars");
    if (!container) return;

    const rows = [
        { label: "Pending",     value: pending,   color: "#f59e0b", count: pending   },
        { label: "In Progress", value: progress,  color: "#3b82f6", count: progress  },
        { label: "Completed",   value: completed, color: "#10b981", count: completed },
        { label: "Rejected",    value: rejected,  color: "#ef4444", count: rejected  }
    ];

    container.innerHTML = "";
    rows.forEach(function (r) {
        const pct = Math.round((r.value / total) * 100);
        const row = document.createElement("div");
        row.className = "sum-bar-row";
        row.innerHTML = `
            <span class="sum-label">${r.label}</span>
            <div class="sum-track">
                <div class="sum-fill"
                     style="width:${pct}%;background:${r.color}"></div>
            </div>
            <span class="sum-val">${r.count}</span>`;
        container.appendChild(row);
    });
}

// ====================================================
// APPLY FILTERS
// ====================================================
function applyFilters() {
    const status = document.getElementById("filterStatus").value;
    const dept   = document.getElementById("filterDept").value;
    const date   = document.getElementById("filterDate").value;

    const filtered = allComplaints.filter(function (c) {
        return (
            (!status || c.status     === status) &&
            (!dept   || c.department === dept)   &&
            (!date   || c.date       === date)
        );
    });
    renderComplaintsTable(filtered);
}

// ====================================================
// GLOBAL SEARCH
// ====================================================
function handleSearch() {
    const q = document.getElementById("globalSearch").value.trim().toLowerCase();
    if (!q) { renderComplaintsTable(allComplaints); return; }

    const filtered = allComplaints.filter(function (c) {
        return (
            c.id.toLowerCase().includes(q)         ||
            c.department.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        );
    });
    renderComplaintsTable(filtered);
}

function attachSearchEnter() {
    const input = document.getElementById("globalSearch");
    if (input) {
        input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") handleSearch();
        });
    }
}

// ====================================================
// VIEW COMPLAINT MODAL
// ====================================================
function viewComplaint(id) {
    const c = allComplaints.find(function (x) { return x.id === id; });
    if (!c) return;

    document.getElementById("viewComplaintBody").innerHTML = `
        <div class="detail-row">
            <span class="detail-key">Complaint ID</span>
            <span class="detail-val">${c.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Department</span>
            <span class="detail-val">${c.department}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Category</span>
            <span class="detail-val">${c.category}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Location</span>
            <span class="detail-val">${c.location || "—"}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Date Filed</span>
            <span class="detail-val">${formatDate(c.date)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Priority</span>
            <span class="detail-val priority-${c.priority}">
                ${c.priority.toUpperCase()}
            </span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Status</span>
            <span class="detail-val">
                <span class="badge-s badge-${c.status}">${c.status}</span>
            </span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Assigned Helper</span>
            <span class="detail-val">${c.helper || "Not yet assigned"}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Emergency</span>
            <span class="detail-val">${c.isEmergency ? "🚨 YES" : "No"}</span>
        </div>
        <div style="margin-top:14px">
            <strong style="font-size:13px;color:#374151">Description:</strong>
            <div class="detail-desc">${c.description}</div>
        </div>
        ${c.adminNote ? `
        <div class="admin-reply-box" style="margin-top:12px">
            <i class="fa fa-comment-dots"></i>
            <div>
                <strong style="font-size:12px;display:block;margin-bottom:2px">
                    Admin Note
                </strong>
                ${c.adminNote}
            </div>
        </div>` : ""}
        ${c.workNote ? `
        <div class="admin-reply-box"
             style="margin-top:10px;background:#f0fdf4;border-color:#a7f3d0">
            <i class="fa fa-wrench" style="color:#059669"></i>
            <div>
                <strong style="font-size:12px;display:block;margin-bottom:2px;color:#065f46">
                    Helper Work Note
                </strong>
                <span style="color:#065f46">${c.workNote}</span>
            </div>
        </div>` : ""}
    `;

    openModal("viewComplaintModal");
}

// ====================================================
// SUBMIT COMPLAINT — LIVE API CALL
// ====================================================
async function submitComplaint() {
    const dept        = document.getElementById("cDept").value;
    const category    = document.getElementById("cCategory").value.trim();
    const location    = document.getElementById("cLocation").value.trim();
    const description = document.getElementById("cDescription").value.trim();
    const priority    = document.getElementById("cPriority").value;
    const isEmergency = document.getElementById("cEmergency").checked;

    if (!dept || !category || !location || !description) {
        showToast("Please fill all required fields", "error");
        return;
    }

    const submitBtn = document.querySelector("#submitComplaintModal .btn-primary");
    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    try {
        const res = await fetch(API_BASE + "/complaints", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                studentId:    getStudentId(),
                studentName:  studentProfile.name || localStorage.getItem("studentName"),
                department:   dept,
                category,
                location,
                description,
                priority,
                isEmergency,
                date: new Date().toISOString().split("T")[0]
            })
        });

        if (!res.ok) throw new Error("HTTP " + res.status);

        // Clear form
        document.getElementById("cDept").value        = "";
        document.getElementById("cCategory").value    = "";
        document.getElementById("cLocation").value    = "";
        document.getElementById("cDescription").value = "";
        document.getElementById("cPriority").value    = "medium";
        document.getElementById("cEmergency").checked = false;

        closeModal("submitComplaintModal");
        await loadComplaints();
        showToast("Complaint submitted successfully!", "success");

    } catch (err) {
        showToast("Failed to submit complaint", "error");
        console.error("submitComplaint:", err);
    } finally {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit';
    }
}

// ====================================================
// OPEN COMPLAINT MODAL WITH PRE-FILLED DEPT/CATEGORY
// ====================================================
function openComplaintFor(dept, category) {
    openModal("submitComplaintModal");

    const deptSel = document.getElementById("cDept");
    if (deptSel && dept) {
        for (let i = 0; i < deptSel.options.length; i++) {
            if (deptSel.options[i].value === dept) {
                deptSel.selectedIndex = i;
                break;
            }
        }
    }

    if (category) {
        const catInput = document.getElementById("cCategory");
        if (catInput) catInput.value = category;
    }
}

// ====================================================
// SUBMIT DEPARTMENT COMPLAINT
// ====================================================
async function submitDeptComplaint(e) {
    e.preventDefault();

    const dept        = document.getElementById("deptSelect").value;
    const title       = document.getElementById("deptTitle").value.trim();
    const description = document.getElementById("deptDesc").value.trim();
    const priority    = document.getElementById("deptPriority").value;

    if (!dept || !title || !description) {
        showToast("Please fill all fields", "error");
        return;
    }

    const btn = document.querySelector("#deptForm button");
    btn.disabled  = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    try {
        const res = await fetch(API_BASE + "/complaints", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                studentId:   getStudentId(),
                studentName: studentProfile.name || localStorage.getItem("studentName"),
                department:  dept,
                category:    title,
                description,
                priority,
                isEmergency: false,
                isDeptComplaint: true,
                date: new Date().toISOString().split("T")[0]
            })
        });

        if (!res.ok) throw new Error("HTTP " + res.status);

        document.getElementById("deptForm").reset();
        await loadComplaints();
        showToast("Department complaint submitted!", "success");

    } catch (err) {
        showToast("Failed to submit", "error");
        console.error("submitDeptComplaint:", err);
    } finally {
        btn.disabled  = false;
        btn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Complaint';
    }
}


// ====================================================
// SUBMIT FEEDBACK — LIVE API CALL
// ====================================================
async function submitFeedback(e) {
    e.preventDefault();

    const complaintId = document.getElementById("fbComplaintId").value.trim();
    const service     = document.getElementById("fbService").value;
    const rating      = parseInt(document.getElementById("fbRating").value) || 0;
    const comment     = document.getElementById("fbComment").value.trim();

    if (!service || !comment) {
        showToast("Please select service and write feedback", "error");
        return;
    }
    if (rating === 0) {
        showToast("Please select a star rating", "error");
        return;
    }

    const btn = document.querySelector("#feedbackForm .submit-btn");
    btn.disabled  = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    try {
        const res = await fetch(API_BASE + "/feedbacks", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                studentId:   getStudentId(),
                student:     studentProfile.name || localStorage.getItem("studentName"),
                complaintId: complaintId || null,
                service,
                rating,
                comment,
                date: new Date().toISOString().split("T")[0]
            })
        });

        if (!res.ok) throw new Error("HTTP " + res.status);

        document.getElementById("feedbackForm").reset();
        resetStars();
        showToast("Feedback submitted! Thank you.", "success");

    } catch (err) {
        showToast("Failed to submit feedback", "error");
        console.error("submitFeedback:", err);
    } finally {
        btn.disabled  = false;
        btn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Feedback';
    }
}

// ====================================================
// SUBMIT SUGGESTION — LIVE API CALL
// ====================================================
async function submitSuggestion(e) {
    e.preventDefault();

    const category   = document.getElementById("sugCategory").value;
    const suggestion = document.getElementById("sugText").value.trim();

    if (!category || !suggestion) {
        showToast("Please fill all fields", "error");
        return;
    }

    const btn = document.querySelector("#suggestionForm .submit-btn");
    btn.disabled  = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    try {
        const res = await fetch(API_BASE + "/suggestions", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                studentId: getStudentId(),
                student:   studentProfile.name || localStorage.getItem("studentName"),
                category,
                suggestion,
                date: new Date().toISOString().split("T")[0]
            })
        });

        if (!res.ok) throw new Error("HTTP " + res.status);

        document.getElementById("suggestionForm").reset();
        showToast("Suggestion submitted! Thank you.", "success");

    } catch (err) {
        showToast("Failed to submit suggestion", "error");
        console.error("submitSuggestion:", err);
    } finally {
        btn.disabled  = false;
        btn.innerHTML = '<i class="fa fa-paper-plane"></i> Submit Suggestion';
    }
}



// ====================================================
// STAR RATING
// ====================================================
function initStarRating() {
    const stars = document.querySelectorAll(".star");
    stars.forEach(function (star) {
        star.addEventListener("mouseover", function () {
            highlightStars(parseInt(this.dataset.val));
        });
        star.addEventListener("mouseout", function () {
            highlightStars(selectedRating);
        });
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.dataset.val);
            document.getElementById("fbRating").value = selectedRating;
            highlightStars(selectedRating);
        });
    });
}

function highlightStars(val) {
    document.querySelectorAll(".star").forEach(function (s) {
        s.classList.toggle("active", parseInt(s.dataset.val) <= val);
    });
}

function resetStars() {
    selectedRating = 0;
    document.getElementById("fbRating").value = 0;
    highlightStars(0);
}

// ====================================================
// NOTIFICATIONS DROPDOWN
// ====================================================
function toggleNotifications() {
    const dd = document.getElementById("notifDropdown");
    dd.classList.toggle("show");
    if (dd.classList.contains("show")) {
        loadNotifications();
    }
}

function closeNotifDropdown() {
    document.getElementById("notifDropdown").classList.remove("show");
}

document.addEventListener("click", function (e) {
    const notif    = document.querySelector(".notification");
    const dropdown = document.getElementById("notifDropdown");
    if (notif && dropdown && !notif.contains(e.target)) {
        dropdown.classList.remove("show");
    }
});

// ====================================================
// POLLING — silent background refresh every 15s
// ====================================================
function startPolling() {
    pollingTimer = setInterval(async function () {
        const freshRes = await fetch(
            API_BASE + "/complaints?studentId=" + getStudentId(),
            { headers: authHeaders() }
        ).catch(function () { return null; });

        if (!freshRes || !freshRes.ok) return;
        const fresh = await freshRes.json();

        if (JSON.stringify(fresh) !== JSON.stringify(allComplaints)) {
            allComplaints = fresh;
            renderComplaintsTable(allComplaints);
            updateStats();
            renderSummaryBars();
            loadNotifications();
            showLivePulse("Complaints updated");
        }
    }, 15000);
}

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        clearInterval(pollingTimer);
    } else {
        loadComplaints();
        startPolling();
    }
});

function showLivePulse(msg) {
    let pulse = document.getElementById("livePulse");
    if (!pulse) {
        pulse = document.createElement("div");
        pulse.id = "livePulse";
        pulse.style.cssText = `
            position:fixed;top:70px;right:18px;
            background:#10b981;color:white;
            padding:5px 14px;border-radius:20px;
            font-size:12px;font-weight:600;z-index:9998;
            display:flex;align-items:center;gap:6px;
            transition:opacity 0.4s;`;
        document.body.appendChild(pulse);
    }
    pulse.innerHTML = `
        <span style="width:7px;height:7px;background:white;
              border-radius:50%;display:inline-block"></span>
        ${msg}`;
    pulse.style.opacity = "1";
    clearTimeout(pulse._t);
    pulse._t = setTimeout(function () {
        pulse.style.opacity = "0";
    }, 2500);
}

// ====================================================
// SUBSCRIBE NEWSLETTER
// ====================================================
async function subscribeNewsletter() {
    const email = document.getElementById("newsletterEmail").value.trim();
    if (!email || !email.includes("@")) {
        showToast("Enter a valid email address", "error");
        return;
    }
    try {
        const res = await fetch(API_BASE + "/newsletter", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ email })
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        document.getElementById("newsletterEmail").value = "";
        showToast("Subscribed successfully!", "success");
    } catch (err) {
        showToast("Subscription failed", "error");
    }
}

// ====================================================
// LOGOUT
// ====================================================
function handleLogout() {
    if (!confirm("Are you sure you want to logout?")) return;

    fetch(API_BASE + "/auth/logout", {
        method: "POST",
        headers: authHeaders()
    }).catch(function () {});

    clearInterval(pollingTimer);
    localStorage.clear();
    window.location.href = "student-login.html";
}

// ====================================================
// MODAL HELPERS
// ====================================================
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("show");
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("show");
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal-overlay")) {
        document.querySelectorAll(".modal-overlay").forEach(function (m) {
            m.classList.remove("show");
        });
    }
});

// ====================================================
// SCROLL
// ====================================================
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ====================================================
// TOAST
// ====================================================
function showToast(msg, type) {
    type = type || "success";
    const toast = document.getElementById("toastMsg");
    if (!toast) return;
    toast.textContent = msg;
    toast.className   = "toast " + type + " show";
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

// ====================================================
// HELPERS
// ====================================================
function formatDate(str) {
    if (!str) return "N/A";
    return new Date(str).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
    });
}

function setTxt(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || "—";
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
}

function buildEmpty(icon, msg) {
    return `<div style="padding:25px;text-align:center;color:#9ca3af;font-size:13px">
        <i class="fa ${icon}"
           style="font-size:26px;display:block;margin-bottom:8px;opacity:0.35">
        </i>${msg}</div>`;
}

function showTableLoading() {
    const tbody = document.getElementById("complaintsBody");
    if (!tbody) return;
    let html = "";
    for (let i = 0; i < 4; i++) {
        html += "<tr>";
        for (let j = 0; j < 8; j++) {
            html += `<td>
                <div style="height:13px;background:#e2e8f0;
                     border-radius:4px;width:${55 + Math.random()*35}%">
                </div></td>`;
        }
        html += "</tr>";
    }
    tbody.innerHTML = html;
}

function showTableError(msg) {
    const tbody = document.getElementById("complaintsBody");
    if (!tbody) return;
    tbody.innerHTML = `
        <tr>
            <td colspan="8"
                style="text-align:center;color:#ef4444;padding:30px;font-size:14px">
                <i class="fa fa-exclamation-circle"></i> ${msg}
            </td>
        </tr>`;
}


function logout(){
    localStorage.removeItem("isLoggedIn");

    // prevent back
    window.location.replace("../loginpages/student-login.html");
}