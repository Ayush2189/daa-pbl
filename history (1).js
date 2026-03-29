// Load submission history on page load
window.onload = loadHistory;

async function loadHistory(){

const student =
JSON.parse(localStorage.getItem("student"));

if(!student){
alert("Student not logged!");
return;
}

try{

const response =
await fetch(
`http://localhost:8080/submissions/student/${student.id}`
);

const submissions =
await response.json();

const tbody =
document.getElementById("historyList");

tbody.innerHTML="";

if(!submissions || submissions.length===0){

tbody.innerHTML=
"<tr><td colspan='8'>No submissions yet</td></tr>";

return;
}

// latest first
submissions.sort(
(a,b)=>
new Date(b.submittedAt)-
new Date(a.submittedAt)
);

submissions.forEach(sub=>{

const tr =
document.createElement("tr");

tr.innerHTML=`

<td>
${sub.assignmentTitle || sub.assignmentId}
</td>

<td>
<span class="status ${sub.status.toLowerCase()}">
${sub.status}
</span>
</td>

<td>
${sub.score}
</td>

<td>
${sub.executionTime || 1} ms
</td>

<td>
${sub.attempts || 1}
</td>

<td>
<button class="output-btn">
View Output
</button>
</td>

<td>
${new Date(sub.submittedAt).toLocaleString()}
</td>

<td>
<button class="code-btn">
View Code
</button>
</td>

`;

tbody.appendChild(tr);

// SAFE EVENT BINDING (IMPORTANT FIX)

const codeBtn =
tr.querySelector(".code-btn");

codeBtn.addEventListener(
"click",
function(){
viewCode(sub.code || "No code");
}
);

const outputBtn =
tr.querySelector(".output-btn");

outputBtn.addEventListener(
"click",
function(){
viewOutput(sub.output || "No output");
}
);

});

}

catch(error){

console.error(
"Error fetching submission history:",
error
);

document
.getElementById("historyList")
.innerHTML=

"<tr><td colspan='8'>Error loading history</td></tr>";

}

}


// VIEW CODE
function viewCode(code){

document
.getElementById("codeContent")
.textContent = code;

document
.getElementById("codeModal")
.style.display="block";

}


// CLOSE CODE
function closeModal(){

document
.getElementById("codeModal")
.style.display="none";

}


// VIEW OUTPUT
function viewOutput(output){

document
.getElementById("outputContent")
.textContent = output;

document
.getElementById("outputModal")
.style.display="block";

}


// CLOSE OUTPUT
function closeOutput(){

document
.getElementById("outputModal")
.style.display="none";

}


// CLOSE IF CLICK OUTSIDE
window.onclick=function(event){

const codeModal=
document.getElementById("codeModal");

const outputModal=
document.getElementById("outputModal");

if(event.target===codeModal)
codeModal.style.display="none";

if(event.target===outputModal)
outputModal.style.display="none";

}


// COPY CODE
function copyCode(){

const code =
document.getElementById("codeContent").textContent;

navigator.clipboard.writeText(code);

alert("Code copied");

}