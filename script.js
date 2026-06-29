const form = document.getElementById("uploadForm");
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const status = document.getElementById("status");

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwlOWDNrACeFRBYJTalGx6uhwHd2_Zxf-2Vzm9jFxbWEc3QhKU8_zXHSWeVlIQyZcdZ7Q/exec";

let selectedFiles = [];

/* ==========================
   OPEN FILE PICKER
========================== */

dropZone.addEventListener("click", () => {
    fileInput.click();
});

/* ==========================
   FILE PICKER
========================== */

fileInput.addEventListener("change", () => {
    addFiles(fileInput.files);
    fileInput.value = "";
});

/* ==========================
   DRAG EVENTS
========================== */

dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", e => {

    e.preventDefault();

    dropZone.classList.remove("dragover");

    addFiles(e.dataTransfer.files);

});

/* ==========================
   ADD FILES
========================== */

function addFiles(files){

    for(const file of files){

        const exists = selectedFiles.some(f =>
            f.name === file.name &&
            f.size === file.size
        );

        if(!exists){

            selectedFiles.push(file);

        }

    }

    renderFiles();

}

/* ==========================
   FILE LIST
========================== */

function renderFiles(){

    if(selectedFiles.length === 0){

        fileList.innerHTML = "No files selected.";

        return;

    }

    fileList.innerHTML = "";

    selectedFiles.forEach((file,index)=>{

        const row = document.createElement("div");

        row.className = "file-item";

        row.innerHTML = `
            <span>${file.name}</span>

            <button
                type="button"
                class="remove-btn"
                onclick="removeFile(${index})">
                Remove
            </button>
        `;

        fileList.appendChild(row);

    });

}

function removeFile(index){

    selectedFiles.splice(index,1);

    renderFiles();

}

window.removeFile = removeFile;

/* ==========================
   SUBMIT
========================== */

form.addEventListener("submit", async function(event){

    event.preventDefault();

    if(selectedFiles.length === 0){

        alert("Please add files first.");

        return;

    }

    if(!confirm("Submit all selected documents?")){

        return;

    }

    const maxSize = 10 * 1024 * 1024;

    for(let i=0;i<selectedFiles.length;i++){

        const file = selectedFiles[i];

        if(file.size > maxSize){

            alert(file.name + " exceeds 10MB.");

            continue;

        }

        status.innerText =
        `Uploading ${i+1} of ${selectedFiles.length}...`;

        const payload = await new Promise(resolve=>{

            const reader = new FileReader();

            reader.onload = ()=>{

                resolve({

                    facultyName:
                    document.getElementById("facultyName").value,

                    semester:
                    document.getElementById("semester").value,

                    department:
                    document.getElementById("department").value,

                    departmentCode:
                    document.getElementById("departmentCode").value,

                    documentType:
                    document.getElementById("documentType").value,

                    fileName:file.name,

                    mimeType:file.type,

                    fileData:
                    reader.result.split(",")[1]

                });

            };

            reader.readAsDataURL(file);

        });

        try{

            const response = await fetch(SCRIPT_URL,{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(payload)

            });

            const result = await response.json();

            if(!result.success){

                alert(result.error);

                status.innerText = "Upload rejected.";

                return;

            }

        }

        catch(error){

            console.error(error);

            alert("Upload failed.");

            status.innerText = "Upload failed.";

            return;

        }

    }

    status.innerText = "All documents uploaded successfully.";

    alert("Documents uploaded successfully.");

    selectedFiles = [];

    renderFiles();

    form.reset();

});
