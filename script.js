// ===============================
// FORM SUBMISSION TEST
// ===============================

const form =
document.getElementById("uploadForm");

form.addEventListener(
"submit",
function(event){

    event.preventDefault();

    // Gets selected file
    const file =
    document.getElementById("file")
    .files[0];

    // No file selected
    if(!file){

        alert(
        "Please select a file."
        );

        return;
    }

    // 10MB Limit
    const maxSize =
    10 * 1024 * 1024;

    if(file.size > maxSize){

        alert(
        "File exceeds 10MB limit."
        );

        return;
    }

    document
    .getElementById("status")
    .innerText =
    "Form validation successful.";

});