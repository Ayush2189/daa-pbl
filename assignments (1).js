// Load assignments on page load
window.onload = loadAssignments;

async function loadAssignments() {
    const topic = document.getElementById("topic").value;
    const difficulty = document.getElementById("difficulty").value;

    let data;

    if (topic && difficulty) {
        data = await apiRequest(`/assignments/filter?topic=${topic}&difficulty=${difficulty}`);
    } else if (topic) {
        data = await apiRequest(`/assignments/topic/${topic}`);
    } else if (difficulty) {
        data = await apiRequest(`/assignments/difficulty/${difficulty}`);
    } else {
        data = await apiRequest(`/assignments`);
    }

    displayAssignments(data);
}

function displayAssignments(assignments) {
    const container = document.getElementById("assignmentList");
    container.innerHTML = "";

    if (!assignments || assignments.length === 0) {
        container.innerHTML = "<p>No assignments found</p>";
        return;
    }

    assignments.forEach(a => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.margin = "10px";

        div.innerHTML = `
            <h3>${a.title}</h3>
            <p><b>Topic:</b> ${a.topic}</p>
            <p><b>Difficulty:</b> ${a.difficulty}</p>
            <p>${a.description}</p>
            <button onclick="openAssignment(${a.id})">Solve</button>
        `;

        container.appendChild(div);
    });
}

function openAssignment(id) {
    localStorage.setItem("assignmentId", id);
    window.location.href = "editor.html";
}