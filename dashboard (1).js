window.addEventListener("load", () => {
    loadDashboard();
    setupHistoryButton();
    setupMenuNavigation();   // ✅ NEW
});

/* ─── HISTORY BUTTON ───────────────── */
function setupHistoryButton() {
    const historyBtn = document.querySelector(".btn"); // fixed
    if (historyBtn) {
        historyBtn.addEventListener("click", () => {
            window.location.href = "history.html";
        });
    }
}

/* ─── SIDEBAR MENU NAVIGATION ─────── */
function setupMenuNavigation() {
    const menuItems = document.querySelectorAll(".menu div");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            const text = item.innerText.trim();

            if (text === "Assignments") {
                window.location.href = "assignments.html";
            }
            else if (text === "Code Editor") {
                window.location.href = "editor.html";
            }
            else if (text === "Logout") {
                localStorage.removeItem("student");
                window.location.href = "login.html";
            }
        });
    });
}

/* ─── LOAD DASHBOARD ───────────────── */
async function loadDashboard() {
    const student = JSON.parse(localStorage.getItem("student"));

    if (!student) {
        alert("Student not logged in!");
        window.location.href = "login.html"; // ✅ redirect fix
        return;
    }

    let analyticsData = {};
    let assignments = [];

    /* ─── FETCH ANALYTICS ───────── */
    try {
        const res = await fetch(`http://localhost:8080/analytics/dashboard/${student.id}`);
        if (!res.ok) throw new Error();

        analyticsData = await res.json();
    } catch (err) {
        console.error("Analytics error:", err);
        analyticsData = {
            averageScore: 0,
            topicScores: {},
            weakTopics: [],
            activeDays: 0,
            ranking: {}
        };
    }

    /* ─── FETCH ASSIGNMENTS ─────── */
    try {
        const res = await fetch("http://localhost:8080/assignments");
        if (!res.ok) throw new Error();

        assignments = await res.json();
    } catch (err) {
        console.error("Assignments error:", err);
        assignments = [];
    }

    /* ─── DISPLAY ───────────────── */
    displayPerformance(analyticsData.averageScore || 0);
    displayTopics(analyticsData.topicScores || {}, analyticsData.weakTopics || []);
    displayConsistency(analyticsData.activeDays || 0);
    displayRanking(analyticsData.ranking || {}, student.id);
    displayAssignments(assignments, analyticsData.weakTopics || []);
}

/* ─── PERFORMANCE ───────────────── */
function displayPerformance(score) {
    const container = document.getElementById("performance");

    if (container) {
        container.innerText = `${score.toFixed(1)}%`;

        const bar = container.nextElementSibling.querySelector(".progress-fill");
        if (bar) bar.style.width = `${score}%`;
    }
}

/* ─── TOPICS ───────────────────── */
function displayTopics(topicScores, weakTopics) {
    const container = document.querySelector(".card:nth-child(2)");
    if (!container) return;

    let html = "";

    for (let topic in topicScores) {
        const score = topicScores[topic];
        const isWeak = weakTopics.includes(topic);

        html += `
            <div style="margin-top:8px; font-weight:500; color:${isWeak ? 'red' : '#333'}">
                ${topic} (${score}%)
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${score}%; background:${isWeak ? '#ff4d4d' : '#ff7a18'}"></div>
            </div>
        `;
    }

    container.innerHTML = `<h3>Topics</h3>` + html;
}

/* ─── CONSISTENCY ─────────────── */
function displayConsistency(days) {
    const container = document.getElementById("consistency");
    if (container) {
        container.innerText = `${days} Day Streak 🔥`;
    }
}

/* ─── RANKING ─────────────────── */
function displayRanking(ranking, studentId) {
    const container = document.getElementById("ranking");
    if (!container) return;

    let html = "";
    let pos = 1;

    for (let id in ranking) {
        const isMe = parseInt(id) === studentId;

        html += `
            <div style="
                margin-bottom:6px;
                font-weight:${isMe ? '700' : '400'};
                color:${isMe ? 'green' : '#333'};
            ">
                #${pos} Student ${id}: ${ranking[id]}%
            </div>
        `;
        pos++;
    }

    container.innerHTML = html || "No ranking data";
}

/* ─── ASSIGNMENTS ─────────────── */
function displayAssignments(assignments, weakTopics) {
    const container = document.getElementById("assignments");

    if (!container) return;

    container.innerHTML = "";

    if (assignments.length === 0) {
        container.innerText = "No assignments available";
        return;
    }

    assignments.forEach(a => {
        const div = document.createElement("div");
        div.classList.add("assignment");

        const isWeak = weakTopics.includes(a.topic);

        div.innerHTML = `
            <strong>${a.title}</strong><br>
            <small>${a.topic} • ${a.difficulty}</small>
        `;

        if (isWeak) {
            div.style.borderLeft = "4px solid red";
        }

        div.addEventListener("click", () => {
            localStorage.setItem("assignmentId", a.id);

            if (a.language) {
                localStorage.setItem("assignmentLanguage", a.language);
            } else {
                localStorage.removeItem("assignmentLanguage");
            }

            window.location.href = "editor.html";
        });

        container.appendChild(div);
    });
}