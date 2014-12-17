/**
 * Created by Asia on 2014-12-09.
 */

function saveTextAsFile()
{
    var textToWrite = document.getElementById("inputText").value;
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
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
        document.getElementById("inputText").value = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");

    document.getElementById("inputFileNameToSaveAs").value = fileToLoad.name;
}

function copy() {
    var srcTextArea = document.getElementById("inputText");
    var destTextArea = document.getElementById("dummyClipboard");
    destTextArea.value = getSelectedText(srcTextArea);
}

function getSelectedText(textArea) {
    if (typeof textArea.selectionStart == "number") {
        return textArea.value.slice(textArea.selectionStart, textArea.selectionEnd);
    } else if (typeof document.selection != "undefined") {
        var range = document.selection.createRange();
        if (range.parentElement() == textArea) {
            return range.text;
        }
    }
    return "";
}

function paste() {
    var textToPaste = document.getElementById("dummyClipboard").value;
    var destTextArea = document.getElementById("inputText");
    var scrollPos = destTextArea.scrollTop;
    var strPos = 0;
    var br = ((destTextArea.selectionStart || destTextArea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") {
        destTextArea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -destTextArea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = destTextArea.selectionStart;

    var front = (destTextArea.value).substring(0,strPos);
    var back = (destTextArea.value).substring(strPos,destTextArea.value.length);
    destTextArea.value=front+textToPaste+back;
    strPos = strPos + textToPaste.length;
    if (br == "ie") {
        destTextArea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -destTextArea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        destTextArea.selectionStart = strPos;
        destTextArea.selectionEnd = strPos;
        destTextArea.focus();
    }
    destTextArea.scrollTop = scrollPos;
}

function cut(){
    var srcTextArea = document.getElementById("inputText");
    replaceSelectedText(srcTextArea);
}

function replaceSelectedText(textArea) {
    var selection = getInputSelection(textArea);
    copy(); //in order to store that value for future pasting possibility
    var val = textArea.value;
    textArea.value = val.slice(0, selection.start) + val.slice(selection.end);
}

function getInputSelection(textArea) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof textArea.selectionStart == "number" && typeof textArea.selectionEnd == "number") {
        start = textArea.selectionStart;
        end = textArea.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == textArea) {
            len = textArea.value.length;
            normalizedValue = textArea.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = textArea.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = textArea.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }
    return {
        start: start,
        end: end
    };
}



