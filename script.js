// =====================================
// FILE QUEUE
// =====================================

let selectedFiles = [];

const fileInput =
document.getElementById("file");

const fileList =
document.getElementById("fileList");

fileInput.addEventListener(
"change",
function(){

const newFiles =
Array.from(fileInput.files);

selectedFiles.push(
...newFiles
);

updateFileList();

fileInput.value = "";

}
);

// =====================================
// UPDATE FILE LIST BOX
// =====================================

function updateFileList(){

if(selectedFiles.length === 0){

fileList.innerHTML =
"No files selected.";

return;

}

fileList.innerHTML = "";

selectedFiles.forEach(
(file,index)=>{

fileList.innerHTML +=
`
<div class="file-item">
${index + 1}. ${file.name}
</div>
`;

}
);

}

// =====================================
// FORM
// =====================================

const form =
document.getElementById("uploadForm");

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwlOWDNrACeFRBYJTalGx6uhwHd2_Zxf-2Vzm9jFxbWEc3QhKU8_zXHSWeVlIQyZcdZ7Q/exec";

form.addEventListener(
"submit",
async function(event){

event.preventDefault();

const status =
document.getElementById("status");

if(selectedFiles.length === 0){

alert(
"Please add at least one file."
);

return;

}

// =====================================
// CONFIRM SUBMISSION
// =====================================

const confirmUpload =
confirm(
"Are you sure you want to submit these document(s)?"
);

if(!confirmUpload){

return;

}

// =====================================
// DUPLICATE WARNING
// =====================================

const duplicateWarning =
confirm(
"Submitting the same document again may create duplicate records.\n\nContinue?"
);

if(!duplicateWarning){

return;

}

status.innerText =
"Preparing upload...";

const maxSize =
10 * 1024 * 1024;

// =====================================
// UPLOAD FILES
// =====================================

for(let i = 0; i < selectedFiles.length; i++){

const file =
selectedFiles[i];

if(file.size > maxSize){

alert(
file.name +
" exceeds the 10MB limit."
);

continue;

}

status.innerText =
"Uploading " +
(i + 1) +
" of " +
selectedFiles.length;

const reader =
new FileReader();

await new Promise((resolve)=>{

reader.onload =
async function(){

try{

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

console.error(error);

}

resolve();

};

reader.readAsDataURL(file);

});

}

// =====================================
// SUCCESS
// =====================================

status.innerText =
"Submission completed successfully.";

alert(
"Documents submitted successfully."
);

form.reset();

selectedFiles = [];

updateFileList();

});
