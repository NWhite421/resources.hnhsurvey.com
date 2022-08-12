var checklistVariables = {};

window.addEventListener("beforeprint", event => {
  console.log(checklistVariables.validPass);
  if (checklistVariables.validPass == null || checklistVariables.validPass != true)
  {
    alert("Please use the \"Print Copy\" under the table of contents to print correctly.");
  }
  // do something
  const textArea = document.getElementById("comment-text");
  const reviewer = document.getElementById("reviewer");
  const checkReview = document.getElementById("include-comments");
  const textPrintArea = document.getElementById("comment-section");
  const textPrintHtml = document.getElementById("comment-area");

  if (checkReview.checked) {
    textPrintArea.removeAttribute('hidden');
    textPrintHtml.innerHTML = convertTextareaToHTML(textArea.value);
    textPrintHtml.innerHTML += "<br><i>Reviewed by: " + reviewer.value + "</i>"
  }
});

window.addEventListener("afterprint", event => {
  const textPrintArea = document.getElementById("comment-section");
  textPrintArea.setAttribute('hidden', 'true');
});

window.addEventListener("load", loadFromReload);

function printFile() {

  const printModal = new bootstrap.Modal('#printModal', {
    keyboard: false,
    focus: true
  });
  printModal.show();
  checklistVariables.printModal = printModal;
}

function confirmPrint() {
  const jobNumberField = document.getElementById("job-number-print");
  const reviewField = document.getElementById("review-number-print");

  var printModal = checklistVariables.printModal;
  printModal.hide();

  document.getElementById("job-number").innerHTML = jobNumberField.value;
  document.getElementById("review-number").innerHTML = reviewField.value;

  checklistVariables.validPass = true;

  window.print();

  checklistVariables.validPass = false;
}

function saveLink() {
  console.log("starting save url generation.");

  const htmlLink = document.getElementById("save-link");
  var buttonStatus = getPassingString();
  console.log(buttonStatus);
  //TODO: Add parameter handling.
  var linkText = window.location.href.split('#')[0].split('?')[0];
  

  var date = new Date();

  linkText += "?reload=true&checkstatus=" + buttonStatus;
  linkText += "&created=" + date.toISOString();

  htmlLink.value = linkText;

  const saveModal = new bootstrap.Modal('#saveModal', {
    keyboard: false,
    focus: true
  });
  saveModal.show();
  checklistVariables.saveModal = saveModal;

}

//http://127.0.0.1:5500/homebuilder/predraw.html?reload=true&checkstatus=1122000000000

function loadFromReload() {
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);

  const isReload = urlParams.get('reload');
  console.log(isReload);
  if (isReload == null || isReload != 'true') {
    return;
  }
  const createDate = new Date(urlParams.get('created'));
  document.getElementById('subtitle').innerHTML += "<br>Originally created: " + createDate.toLocaleString();

  const reviewValues = urlParams.get('checkstatus');
  setScores(reviewValues);
}

function confirmSaveLink() {
  const urlLink = document.getElementById('save-link').value;
  navigator.clipboard.writeText(urlLink);

  const toastLiveExample = document.getElementById('toast-link-success')
  const toast = new bootstrap.Toast(toastLiveExample);

  var saveModal = checklistVariables.saveModal;
  saveModal.hide();

  toast.show();
}

function getRadioGroupValue(name) {
  var radio = document.querySelector('input[name=\"' + name + '\"]:checked').id;
  
  if (radio == null) {
    console.error("Radio group [" + name + "] is not a valid radio group.");
    return false;
  }

  return radio;
}

function setScores(values) {
  const radioGroups = document.querySelectorAll('[role="group"]');
  const valueList = values.split('');
  //console.log("group size: " + radioGroups.length + "; value size: " + valueList.length);

  for (var i = 0; i < radioGroups.length; i++) {
    //console.log("Value for group " + (i+1) + ": " + valueList[i]);
    if (valueList[i] == 0) {
      continue;
    }
    var group = radioGroups[i];
    var radioBtns = group.getElementsByTagName("input");
    var radioBtn = radioBtns[(valueList[i]-1)];
    //console.log("Value for radio button: " + radioBtn);
    if (radioBtn == null) {
      continue;
    }
    radioBtn.checked = true;
  }
}

function getPassingString() {
  const radioGroups = document.querySelectorAll('[role="group"]');
  //console.log("found " + radioGroups.length + " radio groups");
  var retVal = "";

  for (var i = 0; i < radioGroups.length; i++) {
    var selectedIndex = 0;
    //console.log("parsing group " + (i+1));
    var group = radioGroups[i];
    var radioBtns = group.getElementsByTagName("input");
    //console.log("found " + radioBtns.length + " radio buttons in group");
    for (var j = 0; j < radioBtns.length; j++) {
      var radioBtn = radioBtns[j];
      if (radioBtn.checked) {
        selectedIndex = (j+1);
        //console.log("Found selected index: " + j);
        continue;
      }
    }
    retVal = retVal + (selectedIndex);
  }
  return retVal;
}

function toggleComments() {
  const textArea = document.getElementById("comment-text");
  const reviewer = document.getElementById("reviewer");
  const checkReview = document.getElementById("include-comments");
  if (checkReview.checked) {
    textArea.removeAttribute('disabled');
    reviewer.removeAttribute('disabled');
    return;
  }
  textArea.setAttribute('disabled', 'true');
  reviewer.setAttribute('disabled', 'true');
}

function resetAllChecks() {
  const radios = document.querySelectorAll('input[type=radio]');
  var confirmReset = confirm("Are you sure you wish to reset this form. Any inputs will be lost.");
  if (confirmReset) {
    radios.forEach(element => {
      element.checked = false;
    });
    const toastLiveExample = document.getElementById('toast-reset-success')
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
  }
}