// api.js

const BASE_URL = "http://localhost:8080";

// Generic API request function
async function apiRequest(endpoint, method = "GET", body = null) {
    try {
        const options = {
            method,
            headers: { "Content-Type": "application/json" }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Request Failed:", error);
        return null;
    }
}

/* ================= AUTH APIs ================= */

// Login API
async function loginUser(username, password) {
    return await apiRequest("/auth/login", "POST", { username, password });
}

/* ================= ASSIGNMENTS APIs ================= */

async function getAllAssignments() {
    return await apiRequest("/assignments");
}

async function getAssignmentsByTopic(topic) {
    return await apiRequest(`/assignments/topic/${topic}`);
}

async function getAssignmentsByDifficulty(difficulty) {
    return await apiRequest(`/assignments/difficulty/${difficulty}`);
}

async function getAssignmentsByTopicAndDifficulty(topic, difficulty) {
    return await apiRequest(`/assignments/filter?topic=${topic}&difficulty=${difficulty}`);
}

/* ================= SUBMISSIONS APIs ================= */

async function createSubmission(submissionData) {
    return await apiRequest("/submissions", "POST", submissionData);
}

async function getSubmissionsByStudent(studentId) {
    return await apiRequest(`/submissions/student/${studentId}`);
}

async function getSubmissionsByAssignment(assignmentId) {
    return await apiRequest(`/submissions/assignment/${assignmentId}`);
}

async function getSubmissionsByStudentAndAssignment(studentId, assignmentId) {
    return await apiRequest(`/submissions/filter?studentId=${studentId}&assignmentId=${assignmentId}`);
}

/* ================= ANALYTICS APIs ================= */

async function getDashboardAnalytics(studentId, weakThreshold = 60) {
    return await apiRequest(`/analytics/dashboard/${studentId}?weakThreshold=${weakThreshold}`);
}