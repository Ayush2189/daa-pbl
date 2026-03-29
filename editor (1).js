window.onload = () => {
    loadAssignment();
    loadStudent();
};

// Load logged-in student from localStorage
let student = null;
function loadStudent() {
    student = JSON.parse(localStorage.getItem("student"));
    if (!student) {
        alert("Student not logged in!");
        window.location.href = "login.html"; // redirect if needed
    }
}

// Load assignment code on page load
async function loadAssignment() {
    const assignmentId = localStorage.getItem("assignmentId");
    if (!assignmentId) return;

    try {
        const response = await fetch(`http://localhost:8080/assignments`);
        const assignments = await response.json();

        const assignment = assignments.find(a => a.id == assignmentId);

        if (assignment) {
            document.getElementById("editor").value = assignment.starterCode || "";

            // Set default language if assignment specifies
            if (assignment.language && document.getElementById("language")) {
                document.getElementById("language").value = assignment.language.toLowerCase();
            }

        } else {
            alert("Assignment not found");
        }
    } catch (error) {
        console.error("Error loading assignment:", error);
    }
}

// Run code button click
async function runCode() {
    const assignmentId = localStorage.getItem("assignmentId");
    const code = document.getElementById("editor").value;

    const language = document.getElementById("language")?.value || "java";

    if (!student || !assignmentId) {
        alert("Student or assignment not found.");
        return;
    }

    try {
        // Send code as a JSON object
        const response = await fetch(`http://localhost:8080/execute?studentId=${student.id}&assignmentId=${assignmentId}&language=${language}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code }) // ✅ updated
        });

        const result = await response.text();

        // Show output
        document.getElementById("output").innerText = result;

        // Save submission including language
        await saveSubmission(student.id, assignmentId, code, result, language);

    } catch (error) {
        console.error("Error executing code:", error);
        document.getElementById("output").innerText = "Error executing code.";
    }
}

// Save submission to backend
async function saveSubmission(studentId, assignmentId, code, result, language) {
    const status = result.includes("Passed") ? "Passed" : "Failed";
    const score = status === "Passed" ? 100 : 0;

    try {
        await fetch("http://localhost:8080/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId: studentId,
                assignmentId: parseInt(assignmentId),
                code: code,
                language: language,
                status: status,
                score: score
            })
        });
    } catch (error) {
        console.error("Error saving submission:", error);
    }
}