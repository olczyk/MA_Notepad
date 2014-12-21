function saveTextAsFile()
{
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    if( fileNameToSaveAs == null || fileNameToSaveAs == "")
    {
        sweetAlert("Error", "Document title cannot be empty!", "error");

    }
    else
    {
        var fileNameWithExtension = fileNameToSaveAs + ".txt";
        var textToWrite = document.getElementById("inputText").innerHTML;
        var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});

        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameWithExtension;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();

        swal("Success", "Document " + fileNameWithExtension + " has been saved.", "success")
    }
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}


function load() {
    var element = document.getElementById("files");
    element.addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(evt) {

    var fileToLoad = document.getElementById("files").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent)
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("inputText").innerHTML = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");

    document.getElementById("inputFileNameToSaveAs").value = fileToLoad.name;
}

function bold() {
    document.execCommand('bold', false, null);
}

function italic() {
    document.execCommand('italic', false, null);
}

function changeFont(fontSize) {
    document.execCommand("fontSize", false, "7");
    var fontElements = document.getElementsByTagName("font");
    for (var i = 0, len = fontElements.length; i < len; ++i) {
        if (fontElements[i].size == "7") {
            fontElements[i].removeAttribute("size");
            fontElements[i].style.fontSize = fontSize;
        }
    }
}

function changeColor(obj)
{
    document.execCommand("foreColor", false, obj.value);
}