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

const files =
document.getElementById("file")
.files;

if(files.length === 0){

alert(
"Please select at least one file."
);

return;

}

/* ==========================
   CONFIRM SUBMISSION
========================== */

const confirmUpload =
confirm(
"Are you sure you want to submit these document(s)?"
);

if(!confirmUpload){

return;

}

/* ==========================
   DUPLICATE WARNING
========================== */

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

/* ==========================
   LOOP THROUGH FILES
========================== */

for(let i = 0; i < files.length; i++){

const file =
files[i];

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
files.length;

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

console.log(payload);

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

status.innerText =
"Submission completed successfully.";

alert(
"Documents submitted successfully."
);

form.reset();

});
