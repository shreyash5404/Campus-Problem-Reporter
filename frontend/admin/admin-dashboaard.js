// ====================================================
// ADMIN DASHBOARD — admin-dashboard.js
// Backend-Ready: API calls are commented out.
// Replace mock data with real fetch() calls when
// your backend is ready. Look for: 🔁 BACKEND READY
// ====================================================

// ====================================================
// CONFIG — Change these when connecting your backend
// ====================================================
const API_BASE   = "http://localhost:5000/api";      // Your server URL
const AUTH_TOKEN = localStorage.getItem("adminToken"); // JWT token from login

// ====================================================
// MOCK DATA
// Replace these arrays with API responses later
// ====================================================



let complaints = [
    {
        id: "CP2026-001",
        studentName: "Rahul Sharma",
        studentId: "STU001",
        department: "Electrical",
        category: "Power Failure",
        description: "Main power failure in Block C, Room 301. All fans and lights have been non-functional since morning affecting 40+ students.",
        date: "2026-03-10",
        status: "pending",
        priority: "high",
        helper: null,
        isEmergency: false
    },
    {
        id: "CP2026-002",
        studentName: "Priya Singh",
        studentId: "STU002",
        department: "Water & Plumbing",
        category: "Water Cooler Problem",
        description: "Water cooler on 2nd floor near the library entrance is not working. Students are facing difficulty in hot weather.",
        date: "2026-03-11",
        status: "in-progress",
        priority: "medium",
        helper: "Rajesh Plumb",
        isEmergency: false
    },
    {
        id: "CP2026-003",
        studentName: "Amit Kumar",
        studentId: "STU003",
        department: "IT Support",
        category: "WiFi Problem",
        description: "WiFi not connecting in hostel Block B for the past 3 days. Around 80 students are affected.",
        date: "2026-03-12",
        status: "approved",
        priority: "medium",
        helper: null,
        isEmergency: false
    },
    {
        id: "CP2026-004",
        studentName: "Sneha Patel",
        studentId: "STU004",
        department: "Security",
        category: "Street Lights Not Working",
        description: "Street lights near the girls hostel main gate are not working since 2 days. Creating serious safety concerns at night.",
        date: "2026-03-12",
        status: "pending",
        priority: "high",
        helper: null,
        isEmergency: true
    },
    {
        id: "CP2026-005",
        studentName: "Rohan Verma",
        studentId: "STU005",
        department: "BTech - CSE",
        category: "Lab Equipment Issue",
        description: "Computer lab machines in Lab 3 crash frequently during practical exams. System restoration fails every 20 minutes.",
        date: "2026-03-13",
        status: "completed",
        priority: "high",
        helper: "Ramesh IT",
        isEmergency: false
    },
    {
        id: "CP2026-006",
        studentName: "Ananya Rao",
        studentId: "STU006",
        department: "Infrastructure",
        category: "Classroom Maintenance",
        description: "Multiple broken benches and damaged whiteboard in Room 205. Faculty cannot teach properly.",
        date: "2026-03-13",
        status: "pending",
        priority: "low",
        helper: null,
        isEmergency: false
    },
    {
        id: "CP2026-007",
        studentName: "Vikram Nair",
        studentId: "STU007",
        department: "Library",
        category: "Library Complaint",
        description: "Air conditioning unit in the library reading hall is not functional. Very uncomfortable for students during study hours.",
        date: "2026-03-14",
        status: "rejected",
        priority: "low",
        helper: null,
        isEmergency: false
    },
    {
        id: "CP2026-008",
        studentName: "Kavitha M",
        studentId: "STU008",
        department: "MCA",
        category: "Teacher Harassment",
        description: "Faculty member using unfair attendance marking practices. Multiple students impacted in 3rd semester.",
        date: "2026-03-14",
        status: "pending",
        priority: "high",
        helper: null,
        isEmergency: true
    }
];

let helpers = [
    {
        id: "H001",
        name: "Suresh Kumar",
        department: "Electrical",
        contact: "9876543210",
        email: "suresh@campus.edu",
        status: "available",
        assigned: 1
    },
    {
        id: "H002",
        name: "Ramesh IT",
        department: "IT Support",
        contact: "9876543211",
        email: "ramesh@campus.edu",
        status: "busy",
        assigned: 3
    },
    {
        id: "H003",
        name: "Rajesh Plumb",
        department: "Water & Plumbing",
        contact: "9876543212",
        email: "rajesh@campus.edu",
        status: "available",
        assigned: 2
    },
    {
        id: "H004",
        name: "Anand Infra",
        department: "Infrastructure",
        contact: "9876543213",
        email: "anand@campus.edu",
        status: "available",
        assigned: 0
    },
    {
        id: "H005",
        name: "Kumar Security",
        department: "Security",
        contact: "9876543214",
        email: "kumar@campus.edu",
        status: "busy",
        assigned: 2
    }
];

let feedbacks = [
    {
        student: "Rahul Sharma",
        service: "IT Support",
        rating: 4,
        comment: "Issue was resolved within 2 days. Good response time.",
        date: "2026-03-11"
    },
    {
        student: "Priya Singh",
        service: "Electrical",
        rating: 5,
        comment: "Excellent service! Problem was fixed the same day.",
        date: "2026-03-12"
    },
    {
        student: "Amit Kumar",
        service: "Library",
        rating: 3,
        comment: "Took too long but was eventually resolved.",
        date: "2026-03-13"
    },
    {
        student: "Sneha Patel",
        service: "Water & Plumbing",
        rating: 2,
        comment: "Still not fully resolved after 3 days. Need faster response.",
        date: "2026-03-14"
    }
];

let suggestions = [
    {
        student: "Rohan Verma",
        category: "Infrastructure",
        suggestion: "Need more comfortable seating in the library reading hall.",
        date: "2026-03-10"
    },
    {
        student: "Ananya Rao",
        category: "Campus Safety",
        suggestion: "Install CCTV cameras near hostel entrance and corridors.",
        date: "2026-03-11"
    },
    {
        student: "Vikram Nair",
        category: "Academic Improvement",
        suggestion: "Online booking system for lab sessions would help manage queues.",
        date: "2026-03-12"
    }
];

// ====================================================
// STATE
// ====================================================
let currentComplaintId = null;
let currentPage        = 1;
const ITEMS_PER_PAGE   = 6;

// ====================================================
// INIT — Runs when page loads
// ====================================================
document.addEventListener("DOMContentLoaded", function () {
    loadAdminName();
    fetchComplaints();    // Loads table + stats
    renderHelpers();
    renderFeedbacks();
    renderSuggestions();
    renderDeptOverview();
    renderEmergencyCases();
    renderAnalytics();
    populateHelperDropdown();
    checkServerStatus();
    attachSearchEnterKey();
});

// ====================================================
// ADMIN NAME
// ====================================================
function loadAdminName() {
    const name = localStorage.getItem("adminName") || "Admin";
    document.getElementById("adminName").textContent = name;
}

// ====================================================
// FETCH COMPLAINTS
// 🔁 BACKEND READY: Uncomment fetch block below
// ====================================================
async function fetchComplaints() {
    try {

        // 🔁 BACKEND READY — Uncomment these lines:
        // const res = await fetch(`${API_BASE}/complaints`, {
        //     headers: { "Authorization": `Bearer ${AUTH_TOKEN}` }
        // });
        // if (!res.ok) throw new Error("Server error");
        // complaints = await res.json();

        renderComplaints(complaints);
        updateStats();

    } catch (err) {
        showToast("Failed to load complaints", "error");
        console.error("fetchComplaints:", err);
    }
}

// ====================================================
// RENDER COMPLAINTS TABLE
// ====================================================
function renderComplaints(data) {
    const start     = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = data.slice(start, start + ITEMS_PER_PAGE);
    const tbody     = document.getElementById("complaintsBody");
    tbody.innerHTML = "";

    if (paginated.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;color:#9ca3af;padding:40px;font-size:14px">
                    No complaints found matching your filters.
                </td>
            </tr>`;
        renderPagination(0);
        return;
    }

    paginated.forEach(function (c) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <strong style="color:#1e293b">${c.id}</strong>
                ${c.isEmergency ? '<span style="color:#ef4444;font-size:11px;display:block">🚨 EMERGENCY</span>' : ''}
            </td>
            <td>
                <span style="font-weight:600">${c.studentName}</span>
                <br><small style="color:#9ca3af">${c.studentId}</small>
            </td>
            <td>${c.department}</td>
            <td>${c.category}</td>
            <td>${formatDate(c.date)}</td>
            <td><span class="priority-${c.priority}">${c.priority.toUpperCase()}</span></td>
            <td><span class="badge badge-${c.status}">${c.status}</span></td>
            <td>
                <button class="btn-view"   onclick="viewComplaint('${c.id}')">View</button>
                <button class="btn-assign" onclick="openAssignFor('${c.id}')">Assign</button>
                ${c.status !== "completed" && c.status !== "rejected"
                    ? `<button class="btn-resolve" onclick="quickResolve('${c.id}')">Resolve</button>`
                    : ""}
                ${c.status === "pending"
                    ? `<button class="btn-reject" onclick="rejectComplaint('${c.id}')">Reject</button>`
                    : ""}
            </td>
        `;
        tbody.appendChild(row);
    });

    renderPagination(data.length);
}

// ====================================================
// PAGINATION
// ====================================================
function renderPagination(total) {
    const pages     = Math.ceil(total / ITEMS_PER_PAGE) || 1;
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    for (let i = 1; i <= pages; i++) {
        const btn     = document.createElement("button");
        btn.className = "page-btn" + (i === currentPage ? " active" : "");
        btn.textContent = i;
        btn.onclick   = function () {
            currentPage = i;
            applyFilters();
        };
        container.appendChild(btn);
    }
}

// ====================================================
// UPDATE STAT CARDS
// ====================================================
function updateStats() {
    document.getElementById("totalCount").textContent =
        complaints.length;
    document.getElementById("pendingCount").textContent =
        complaints.filter(function (c) { return c.status === "pending"; }).length;
    document.getElementById("inprogressCount").textContent =
        complaints.filter(function (c) { return c.status === "in-progress"; }).length;
    document.getElementById("resolvedCount").textContent =
        complaints.filter(function (c) { return c.status === "completed"; }).length;
    document.getElementById("emergencyCount").textContent =
        complaints.filter(function (c) { return c.isEmergency; }).length;

    // Update notification bell count
    const pending = complaints.filter(function (c) { return c.status === "pending"; }).length;
    document.getElementById("notifCount").textContent = pending > 9 ? "9+" : pending;
}

// ====================================================
// APPLY FILTERS
// ====================================================
function applyFilters() {
    const status   = document.getElementById("filterStatus").value;
    const dept     = document.getElementById("filterDept").value;
    const priority = document.getElementById("filterPriority").value;
    const date     = document.getElementById("filterDate").value;

    const filtered = complaints.filter(function (c) {
        return (
            (!status   || c.status     === status)   &&
            (!dept     || c.department === dept)     &&
            (!priority || c.priority   === priority) &&
            (!date     || c.date       === date)
        );
    });

    renderComplaints(filtered);
}

// ====================================================
// GLOBAL SEARCH
// ====================================================
function handleSearch() {
    const query = document.getElementById("globalSearch").value.trim().toLowerCase();
    if (!query) {
        renderComplaints(complaints);
        return;
    }

    const filtered = complaints.filter(function (c) {
        return (
            c.id.toLowerCase().includes(query)          ||
            c.studentName.toLowerCase().includes(query)  ||
            c.department.toLowerCase().includes(query)   ||
            c.category.toLowerCase().includes(query)     ||
            c.studentId.toLowerCase().includes(query)
        );
    });

    renderComplaints(filtered);
}

function attachSearchEnterKey() {
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
    const c = complaints.find(function (x) { return x.id === id; });
    if (!c) return;
    currentComplaintId = id;

    document.getElementById("viewModalBody").innerHTML = `
        <div class="detail-row">
            <span class="detail-key">Complaint ID</span>
            <span class="detail-val">${c.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Student Name</span>
            <span class="detail-val">${c.studentName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Student ID</span>
            <span class="detail-val">${c.studentId}</span>
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
            <span class="detail-key">Date Filed</span>
            <span class="detail-val">${formatDate(c.date)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Priority</span>
            <span class="detail-val priority-${c.priority}">${c.priority.toUpperCase()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Status</span>
            <span class="detail-val"><span class="badge badge-${c.status}">${c.status}</span></span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Assigned Helper</span>
            <span class="detail-val">${c.helper || "Not Assigned"}</span>
        </div>
        <div class="detail-row">
            <span class="detail-key">Emergency</span>
            <span class="detail-val">${c.isEmergency ? "🚨 YES" : "No"}</span>
        </div>
        <div style="margin-top:14px">
            <strong style="font-size:13px;color:#374151">Description:</strong>
            <div class="detail-desc">${c.description}</div>
        </div>
    `;

    document.getElementById("statusUpdateSelect").value = c.status;
    openModal("viewModal");
}

// ====================================================
// UPDATE STATUS FROM MODAL
// 🔁 BACKEND READY: Uncomment fetch block
// ====================================================
async function updateStatusFromModal() {
    const newStatus = document.getElementById("statusUpdateSelect").value;
    if (!currentComplaintId) return;

    try {
        // 🔁 BACKEND READY — Uncomment:
        // await fetch(`${API_BASE}/complaints/${currentComplaintId}/status`, {
        //     method: "PATCH",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${AUTH_TOKEN}`
        //     },
        //     body: JSON.stringify({ status: newStatus })
        // });

        complaints = complaints.map(function (c) {
            return c.id === currentComplaintId ? Object.assign({}, c, { status: newStatus }) : c;
        });

        closeModal("viewModal");
        renderComplaints(complaints);
        updateStats();
        renderAnalytics();
        renderEmergencyCases();
        showToast("Status updated to: " + newStatus, "success");

    } catch (err) {
        showToast("Failed to update status", "error");
        console.error("updateStatus:", err);
    }
}

// ====================================================
// QUICK RESOLVE
// 🔁 BACKEND READY: Add fetch inside
// ====================================================
async function quickResolve(id) {
    if (!confirm("Mark complaint " + id + " as Completed?")) return;
    try {
        // 🔁 BACKEND READY — Add PATCH call here

        complaints = complaints.map(function (c) {
            return c.id === id ? Object.assign({}, c, { status: "completed" }) : c;
        });

        renderComplaints(complaints);
        updateStats();
        renderAnalytics();
        renderEmergencyCases();
        showToast(id + " marked as Completed!", "success");
    } catch (err) {
        showToast("Action failed", "error");
    }
}

// ====================================================
// REJECT COMPLAINT
// ====================================================
function rejectComplaint(id) {
    if (!confirm("Reject complaint " + id + "?")) return;

    complaints = complaints.map(function (c) {
        return c.id === id ? Object.assign({}, c, { status: "rejected" }) : c;
    });

    renderComplaints(complaints);
    updateStats();
    showToast(id + " rejected.", "error");
}

// ====================================================
// OPEN ASSIGN MODAL FOR SPECIFIC COMPLAINT
// ====================================================
function openAssignFor(id) {
    document.getElementById("assignComplaintId").value = id;
    openModal("assignModal");
}

// ====================================================
// ASSIGN HELPER
// 🔁 BACKEND READY: Uncomment fetch block
// ====================================================
async function assignHelper() {
    const complaintId  = document.getElementById("assignComplaintId").value.trim();
    const helperName   = document.getElementById("assignHelperSelect").value;
    const priority     = document.getElementById("assignPriority").value;
    const note         = document.getElementById("assignNote").value.trim();

    if (!complaintId || !helperName) {
        showToast("Please fill Complaint ID and select a Helper", "error");
        return;
    }

    const complaint = complaints.find(function (c) { return c.id === complaintId; });
    if (!complaint) {
        showToast("Complaint ID not found: " + complaintId, "error");
        return;
    }

    try {
        // 🔁 BACKEND READY — Uncomment:
        // await fetch(`${API_BASE}/complaints/${complaintId}/assign`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${AUTH_TOKEN}`
        //     },
        //     body: JSON.stringify({ helperName, priority, note })
        // });

        complaints = complaints.map(function (c) {
            return c.id === complaintId
                ? Object.assign({}, c, { helper: helperName, status: "approved", priority: priority })
                : c;
        });

        closeModal("assignModal");
        document.getElementById("assignNote").value = "";
        renderComplaints(complaints);
        updateStats();
        showToast("Helper " + helperName + " assigned to " + complaintId, "success");

    } catch (err) {
        showToast("Assignment failed", "error");
        console.error("assignHelper:", err);
    }
}

// ====================================================
// ADD HELPER
// 🔁 BACKEND READY: Uncomment fetch block
// ====================================================
async function addHelper() {
    const name    = document.getElementById("helperName").value.trim();
    const dept    = document.getElementById("helperDept").value;
    const contact = document.getElementById("helperContact").value.trim();
    const email   = document.getElementById("helperEmail").value.trim();

    if (!name || !contact || !email) {
        showToast("Please fill all fields", "error");
        return;
    }

    if (contact.length !== 10 || isNaN(contact)) {
        showToast("Enter a valid 10-digit contact number", "error");
        return;
    }

    const newHelper = {
        id:         "H" + String(helpers.length + 1).padStart(3, "0"),
        name:       name,
        department: dept,
        contact:    contact,
        email:      email,
        status:     "available",
        assigned:   0
    };

    try {
        // 🔁 BACKEND READY — Uncomment:
        // const res = await fetch(`${API_BASE}/helpers`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${AUTH_TOKEN}`
        //     },
        //     body: JSON.stringify(newHelper)
        // });
        // const saved = await res.json();
        // helpers.push(saved);

        helpers.push(newHelper);
        renderHelpers();
        populateHelperDropdown();
        closeModal("addHelperModal");

        // Reset form
        document.getElementById("helperName").value    = "";
        document.getElementById("helperContact").value = "";
        document.getElementById("helperEmail").value   = "";

        showToast("Helper " + name + " added!", "success");

    } catch (err) {
        showToast("Failed to add helper", "error");
        console.error("addHelper:", err);
    }
}

// ====================================================
// RENDER HELPERS GRID
// ====================================================
function renderHelpers() {
    const grid = document.getElementById("helpersGrid");
    grid.innerHTML = "";

    helpers.forEach(function (h) {
        const card = document.createElement("div");
        card.className = "helper-card";
        card.innerHTML = `
            <div class="helper-avatar">${h.name.charAt(0).toUpperCase()}</div>
            <div class="helper-info">
                <h4>${h.name}</h4>
                <p>${h.department}</p>
                <p style="color:#9ca3af">${h.contact} &nbsp;|&nbsp; ${h.email}</p>
                <span class="helper-status-badge ${h.status === 'available' ? 'status-available' : 'status-busy'}">
                    ${h.status === "available" ? "✅ Available" : "⏳ Busy"}
                </span>
                <p style="font-size:11px;margin-top:5px;color:#9ca3af">
                    ${h.assigned} task(s) assigned
                </p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ====================================================
// POPULATE HELPER DROPDOWN IN ASSIGN MODAL
// ====================================================
function populateHelperDropdown() {
    const sel = document.getElementById("assignHelperSelect");
    sel.innerHTML = "";

    helpers.forEach(function (h) {
        const opt = document.createElement("option");
        opt.value       = h.name;
        opt.textContent = h.name + " (" + h.department + ") — " + h.status;
        sel.appendChild(opt);
    });
}

// ====================================================
// RENDER EMERGENCY CASES
// ====================================================
function renderEmergencyCases() {
    const grid       = document.getElementById("emergencyGrid");
    const emergencies = complaints.filter(function (c) {
        return c.isEmergency && c.status !== "completed";
    });

    grid.innerHTML = "";

    if (emergencies.length === 0) {
        grid.innerHTML = `
            <p style="color:#6b7280;font-size:14px;padding:10px">
                ✅ No active emergency cases at this time.
            </p>`;
        return;
    }

    emergencies.forEach(function (c) {
        const card = document.createElement("div");
        card.className = "emerg-card";
        card.innerHTML = `
            <h4>🚨 ${c.category}</h4>
            <p><strong>ID:</strong> ${c.id}</p>
            <p><strong>Student:</strong> ${c.studentName} (${c.studentId})</p>
            <p><strong>Department:</strong> ${c.department}</p>
            <p><strong>Date:</strong> ${formatDate(c.date)}</p>
            <div class="desc">${c.description}</div>
            <div class="emerg-actions">
                <button class="btn-view"    onclick="viewComplaint('${c.id}')">
                    <i class="fa fa-eye"></i> View
                </button>
                <button class="btn-assign"  onclick="openAssignFor('${c.id}')">
                    <i class="fa fa-user"></i> Assign
                </button>
                <button class="btn-resolve" onclick="quickResolve('${c.id}')">
                    <i class="fa fa-check"></i> Resolve
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ====================================================
// DEPARTMENT OVERVIEW
// ====================================================
function renderDeptOverview() {
    const deptMap = {};

    complaints.forEach(function (c) {
        if (!deptMap[c.department]) {
            deptMap[c.department] = { total: 0, pending: 0 };
        }
        deptMap[c.department].total++;
        if (c.status === "pending") deptMap[c.department].pending++;
    });

    const grid = document.getElementById("deptGrid");
    grid.innerHTML = "";

    Object.entries(deptMap).forEach(function (entry) {
        const dept = entry[0];
        const data = entry[1];
        const card = document.createElement("div");
        card.className = "dept-stat-card";
        card.onclick   = function () {
            document.getElementById("filterDept").value = dept;
            applyFilters();
            scrollToSection("complaints");
        };
        card.innerHTML = `
            <h4>${dept}</h4>
            <div class="dept-count">${data.total}</div>
            <div class="dept-pending-label">
                ${data.pending > 0 ? data.pending + " pending" : "All resolved"}
            </div>
        `;
        grid.appendChild(card);
    });
}

// ====================================================
// FEEDBACK
// ====================================================
function renderFeedbacks() {
    const list = document.getElementById("feedbackList");
    list.innerHTML = "";

    feedbacks.forEach(function (f) {
        const item = document.createElement("div");
        item.className = "review-item";
        item.innerHTML = `
            <h4>${f.student}</h4>
            <div class="service-label">${f.service}</div>
            <div class="stars">${"⭐".repeat(f.rating)}${"☆".repeat(5 - f.rating)}</div>
            <p>${f.comment}</p>
            <div class="review-date">${formatDate(f.date)}</div>
        `;
        list.appendChild(item);
    });
}

function renderSuggestions() {
    const list = document.getElementById("suggestionList");
    list.innerHTML = "";

    suggestions.forEach(function (s) {
        const item = document.createElement("div");
        item.className = "review-item";
        item.innerHTML = `
            <h4>${s.student}</h4>
            <div class="service-label">${s.category}</div>
            <p>${s.suggestion}</p>
            <div class="review-date">${formatDate(s.date)}</div>
        `;
        list.appendChild(item);
    });
}

function switchTab(tab, btn) {
    document.querySelectorAll(".tab-btn").forEach(function (b) {
        b.classList.remove("active");
    });
    btn.classList.add("active");

    document.getElementById("feedbackList").style.display   = tab === "feedback"   ? "grid" : "none";
    document.getElementById("suggestionList").style.display = tab === "suggestion" ? "grid" : "none";
}

// ====================================================
// ANALYTICS — CSS Bar Charts
// ====================================================
function renderAnalytics() {

    // Status chart
    var statusData = {
        "Pending":     complaints.filter(function (c) { return c.status === "pending"; }).length,
        "Approved":    complaints.filter(function (c) { return c.status === "approved"; }).length,
        "In Progress": complaints.filter(function (c) { return c.status === "in-progress"; }).length,
        "Completed":   complaints.filter(function (c) { return c.status === "completed"; }).length,
        "Rejected":    complaints.filter(function (c) { return c.status === "rejected"; }).length
    };
    var statusColors = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444"];
    renderBarChart("statusChart", statusData, statusColors);

    // Department chart — top 5
    var deptMap = {};
    complaints.forEach(function (c) {
        deptMap[c.department] = (deptMap[c.department] || 0) + 1;
    });
    var sortedDepts = Object.entries(deptMap)
        .sort(function (a, b) { return b[1] - a[1]; })
        .slice(0, 5);
    var deptData = {};
    sortedDepts.forEach(function (entry) { deptData[entry[0]] = entry[1]; });
    renderBarChart("deptChart", deptData, ["#14b8a6"]);

    // Monthly trend (mock — replace with real API data)
    var trendData = {
        "Jan": 5,
        "Feb": 8,
        "Mar": complaints.length,
        "Apr": 0
    };
    renderBarChart("trendChart", trendData, ["#1e293b"]);
}

function renderBarChart(containerId, data, colors) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    var entries = Object.entries(data);
    var max     = Math.max.apply(null, entries.map(function (e) { return e[1]; })) || 1;

    entries.forEach(function (entry, i) {
        var label   = entry[0];
        var value   = entry[1];
        var percent = Math.round((value / max) * 100);
        var color   = colors[i % colors.length];

        var row = document.createElement("div");
        row.className = "bar-row";
        row.innerHTML = `
            <span class="bar-label" title="${label}">${label}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width:${percent}%;background:${color}"></div>
            </div>
            <span class="bar-value">${value}</span>
        `;
        container.appendChild(row);
    });
}

// ====================================================
// NOTIFICATIONS DROPDOWN
// ====================================================
function toggleNotifications() {
    var dropdown = document.getElementById("notifDropdown");
    dropdown.classList.toggle("show");
}

// Close dropdown on outside click
document.addEventListener("click", function (e) {
    var bell     = document.querySelector(".notification-bell");
    var dropdown = document.getElementById("notifDropdown");
    if (bell && dropdown && !bell.contains(e.target)) {
        dropdown.classList.remove("show");
    }
});

// ====================================================
// MODAL OPEN / CLOSE
// ====================================================
function openModal(id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.add("show");
}

function closeModal(id) {
    var modal = document.getElementById(id);
    if (modal) modal.classList.remove("show");
}

// Close modal when clicking overlay background
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal-overlay")) {
        document.querySelectorAll(".modal-overlay").forEach(function (m) {
            m.classList.remove("show");
        });
    }
});

// ====================================================
// EXPORT CSV
// 🔁 BACKEND READY: Can also be a server-side export
// ====================================================
function exportCSV() {
    var headers = ["ID", "Student", "Student ID", "Department",
                   "Category", "Date", "Priority", "Status", "Helper"];

    var rows = complaints.map(function (c) {
        return [
            c.id, c.studentName, c.studentId, c.department,
            c.category, c.date, c.priority, c.status, c.helper || "None"
        ];
    });

    var csv  = [headers].concat(rows)
        .map(function (r) { return r.join(","); })
        .join("\n");

    var blob = new Blob([csv], { type: "text/csv" });
    var link = document.createElement("a");
    link.href     = URL.createObjectURL(blob);
    link.download = "complaints_" + new Date().toISOString().split("T")[0] + ".csv";
    link.click();

    showToast("CSV exported successfully!", "success");
}

// ====================================================
// LOGOUT
// ====================================================
function handleLogout() {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.clear();

    // 🔁 BACKEND READY — Optionally hit logout endpoint:
    // fetch(`${API_BASE}/auth/logout`, { method: "POST",
    //     headers: { "Authorization": `Bearer ${AUTH_TOKEN}` }
    // });

    window.location.href = "../index.html";
}

// ====================================================
// SCROLL TO SECTION
// ====================================================
function scrollToSection(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ====================================================
// TOAST NOTIFICATION
// ====================================================
function showToast(msg, type) {
    type = type || "success";
    var toast = document.getElementById("toastMsg");
    if (!toast) return;

    toast.textContent = msg;
    toast.className   = "toast " + type + " show";

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

// ====================================================
// FORMAT DATE
// ====================================================
function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    var d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
        day:   "2-digit",
        month: "short",
        year:  "numeric"
    });
}

// ====================================================
// SERVER STATUS CHECK
// 🔁 BACKEND READY: Uncomment fetch block
// ====================================================
async function checkServerStatus() {
    var start = performance.now();
    try {
        // 🔁 BACKEND READY — Uncomment:
        // await fetch(`${API_BASE}/health`);

        var time = Math.round(performance.now() - start);
        document.getElementById("serverStatus").textContent  = "Server Status: ✅ Operational";
        document.getElementById("responseTime").textContent  = "Response Time: " + time + "ms";
    } catch (e) {
        document.getElementById("serverStatus").textContent  = "Server Status: ⚠️ Offline";
        document.getElementById("responseTime").textContent  = "Response Time: --ms";
    }
}

// ====================================================
// BUG REPORT
// 🔁 BACKEND READY: Uncomment fetch block
// ====================================================
async function submitBugReport() {
    var desc = document.getElementById("bugReport").value.trim();
    if (!desc) {
        showToast("Please describe the issue first", "error");
        return;
    }

    try {
        // 🔁 BACKEND READY — Uncomment:
        // await fetch(`${API_BASE}/bugs`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${AUTH_TOKEN}`
        //     },
        //     body: JSON.stringify({
        //         description: desc,
        //         reportedAt: new Date().toISOString(),
        //         reportedBy: "admin"
        //     })
        // });

        document.getElementById("bugReport").value = "";
        showToast("Bug report submitted. Thank you!", "success");

    } catch (e) {
        showToast("Failed to submit report", "error");
    }
}






fetch("http://localhost/CAMPUS-PROBLEM-REPORTER/backend/get_complaints.php")
.then(res => res.json())
.then(data => {
    let html = "";

    data.forEach(c => {
        html += `
        <div class="card">
            <b>${c.complaint_id}</b><br>
            <b>Name:</b> ${c.name}<br>
            <b>Location:</b> ${c.location}<br>
            <b>Problem:</b> ${c.description}<br><br>

            <button class="btn copy" onclick="copyText('${c.description}')">Copy</button>
            <button class="btn accept" onclick="updateStatus(${c.id},'accepted')">Accept</button>
            <button class="btn reject" onclick="updateStatus(${c.id},'rejected')">Reject</button>
        </div>`;
    });

    document.getElementById("list").innerHTML = html;
});

function copyText(text){
    navigator.clipboard.writeText(text);
    alert("Copied!");
}

function updateStatus(id, status){
    fetch("backend/update_status.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({id, status})
    }).then(()=>location.reload());
}



//fake logout functionality
function fakeLogout(){
    // redirect to index page
    window.location.replace("index.html");
}
window.history.forward();


