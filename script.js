const form =
document.getElementById("uploadForm");

const dropZone =
document.getElementById("dropZone");

const fileInput =
document.getElementById("fileInput");

const fileList =
document.getElementById("fileList");

const status =
document.getElementById("status");

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwlOWDNrACeFRBYJTalGx6uhwHd2_Zxf-2Vzm9jFxbWEc3QhKU8_zXHSWeVlIQyZcdZ7Q/exec";

let selectedFiles = [];

/* ==========================
   OPEN FILE PICKER
========================== */

dropZone.addEventListener(
"click",
function(){

fileInput.click();

}
);

/* ==========================
   FILE PICKER
========================== */

fileInput.addEventListener(
"change",
function(){

addFiles(fileInput.files);

}
);

/* ==========================
   DRAG EVENTS
========================== */

dropZone.addEventListener(
"dragover",
function(e){

e.preventDefault();

dropZone.classList.add(
"dragover"
);

}
);

dropZone.addEventListener(
"dragleave",
function(){

dropZone.classList.remove(
"dragover"
);

}
);

dropZone.addEventListener(
"drop",
function(e){

e.preventDefault();

dropZone.classList.remove(
"dragover"
);

addFiles(
e.dataTransfer.files
);

}
);

/* ==========================
   ADD FILES
========================== */

function addFiles(files){

for(const file of files){

selectedFiles.push(file);

}

renderFiles();

}

/* ==========================
   RENDER FILES
========================== */

function renderFiles(){

if(selectedFiles.length === 0){

fileList.innerHTML =
"No files selected.";

return;

}

fileList.innerHTML = "";

selectedFiles.forEach(
(file,index)=>{

const row =
document.createElement("div");

row.className =
"file-item";

row.innerHTML =
`
<span>${file.name}</span>

<button
type="button"
class="remove-btn"
onclick="removeFile(${index})">

Remove

</button>
`;

fileList.appendChild(row);

}
);

}

/* ==========================
   REMOVE FILE
========================== */

function removeFile(index){

selectedFiles.splice(
index,
1
);

renderFiles();

}

window.removeFile =
removeFile;

/* ==========================
   SUBMIT
========================== */

form.addEventListener(
"submit",
async function(event){

event.preventDefault();

if(selectedFiles.length === 0){

alert(
"Please add files first."
);

return;

}

if(!confirm(
"Submit all files?"
)){

return;

}

const maxSize =
10 * 1024 * 1024;

for(let i = 0; i < selectedFiles.length; i++){

const file =
selectedFiles[i];

if(file.size > maxSize){

alert(
file.name +
" exceeds 10MB."
);

continue;

}

status.innerText =
"Uploading " +
(i+1) +
" of " +
selectedFiles.length;

const reader =
new FileReader();

await new Promise(resolve=>{

reader.onload =
async function(){

const payload = {

facultyName:
document.getElementById(
"facultyName"
).value,

semester:
document.getElementById(
"semester"
).value,

department:
document.getElementById(
"department"
).value,

documentType:
document.getElementById(
"documentType"
).value,

fileName:
file.name,

mimeType:
file.type,

fileData:
reader.result.split(",")[1]

};

try{

await fetch(
SCRIPT_URL,
{
method:"POST",
mode:"no-cors",
body:
JSON.stringify(payload)
}
);

}
catch(error){

console.log(error);

}

resolve();

};

reader.readAsDataURL(file);

});

}

status.innerText =
"Submission completed.";

alert(
"Documents submitted successfully."
);

selectedFiles = [];

renderFiles();

form.reset();

});
