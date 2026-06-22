const form = document.getElementById("uploadForm");

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwlOWDNrACeFRBYJTalGx6uhwHd2_Zxf-2Vzm9jFxbWEc3QhKU8_zXHSWeVlIQyZcdZ7Q/exec";

form.addEventListener(
"submit",
async function(event){

event.preventDefault();

const status =
document.getElementById("status");

const file =
document.getElementById("file")
.files[0];

if(!file){

alert("Please select a file.");

return;

}

const maxSize =
10 * 1024 * 1024;

if(file.size > maxSize){

alert("File exceeds 10MB.");

return;

}

status.innerText =
"Preparing upload...";

const reader =
new FileReader();

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

status.innerText =
"Uploading...";

/*
NO HEADERS
NO CONTENT-TYPE

This avoids Apps Script
CORS preflight issues.
*/

await fetch(
SCRIPT_URL,
{
method:"POST",
mode:"no-cors",
body:
JSON.stringify(payload)
}
);

status.innerText =
"Upload sent. Check Drive and Sheets.";

form.reset();

}

catch(error){

console.error(error);

status.innerText =
"Connection error.";

}

};

reader.readAsDataURL(file);

});
