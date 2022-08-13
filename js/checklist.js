/*
 * File: checklist.js
 * Path: \js
 * Project: HNH Resources Website
 * Created Date: 08-11-2022 19-53-07
 * Author: Nathan White
 * -----
 * Last Modified: 08-13-2022 12-23-46
 * Modified By: Nathan White
 * -----
 * Copyright (c) 2022 Exacta Land Surveying
 */

// #region Variables

var checklistVariables = {};

// #endregion

// #region before printing

window.addEventListener("beforeprint", event => {
  console.log(checklistVariables.validPass);
  if (checklistVariables.validPass == null || checklistVariables.validPass != true)
  {
    alert("Please use the \"Print Copy\" under the table of contents to print correctly.");
  }
  convertButtonsToStatus();
  convertCommentsToPrint();
});

function convertCommentsToPrint() {
  const textArea = document.getElementById("comment-text");
  const reviewer = document.getElementById("reviewer");
  const checkReview = document.getElementById("include-comments");
  const textPrintHtml = document.getElementById("comment-area");

  if (checkReview.checked) {
    textPrintHtml.innerHTML = convertTextareaToHTML(textArea.value);
    textPrintHtml.innerHTML += "<i>Reviewed by: " + reviewer.value + "</i>"
  } else {
    textPrintHtml.innerHTML = "<i>No comments</i>";
  }
}

function convertButtonsToStatus() {
  const checkedButtons = document.querySelectorAll('input[type=radio]:checked');
  console.log(checkedButtons.length);

  checkedButtons.forEach(button => {
    // console.log(button);
    const buttonValue = button.getAttribute("data-bs-statusText");
    if (buttonValue != null) {
      const buttonClasses = button.getAttribute("data-bs-statusClasses");
      const resultFieldId = button.parentElement.getAttribute("data-int-status");
      var resultField = document.getElementById(resultFieldId);
      if (resultField != null) {
        resultField.classList = "d-none d-print-inline " + buttonClasses;
        resultField.innerText = buttonValue;
      }
      else {
        console.error("could not find the element \"" + resultFieldId + "\"");
      }
    }
    else {
      console.error("The button was not properly configured \"" + button.getAttribute("id") + "\"");
    }
  })
}

// #endregion

// #region after printing

window.addEventListener("afterprint", event => {
  const textPrintArea = document.getElementById("comment-section");
  textPrintArea.setAttribute('hidden', 'true');
});

// #endregion

// #region loading window

window.addEventListener("load", event => {
  loadFromReload();
  //debugModal();
});

function debugModal() {
  printFile();
}

function loadFromReload() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const isReload = urlParams.get('reload');
  if (isReload == null || isReload != 'true') {
    return;
  }
  const createDate = new Date(urlParams.get('created'));
  document.getElementById('subtitle').innerHTML += "<br>Originally created: " + createDate.toLocaleString();
  const lastUpdate = new Date(document.querySelector('meta[name="last-update"]').content);
  if (lastUpdate > createDate) 
  {
    alert("The link you followed was created on an outdated checklist. The checklist may or may not be accurate.");
  }

  var jobNumber = urlParams.get('jobNumber');
  if (jobNumber != null && jobNumber != "") {
    document.getElementById("job-number-print").value = jobNumber;
  }

  const reviewNumber = urlParams.get('review');
  if (reviewNumber != null && reviewNumber != "") {
    document.getElementById("review-number-print").value = reviewNumber;
  }
  
  const reviewName = urlParams.get('reviewerName');
  if (reviewName != null && reviewName != "") {
    document.getElementById("reviewer").value = reviewName;
  }

  const reviewValues = urlParams.get('checkstatus');
  setScores(reviewValues);
}

// #endregion

// #region Print / Save Dialog

function printFile() {

  const printModal = new bootstrap.Modal('#printModal', {
    keyboard: false,
    focus: true
  });
  printModal.show();
  checklistVariables.printModal = printModal;
  getSaveLink();
  document.getElementById("print-error").setAttribute("hidden", "true");
}

function confirmPrint() {
  const reviewComments = verifyPrintInputs();
  if (reviewComments.length > 0) {
    var commentList = document.getElementById("print-error-list");
    commentList.innerHTML = "";
    reviewComments.forEach(comment => {
      commentList.innerHTML += "<li>" + comment + "</li>"
    });
    document.getElementById("print-error").removeAttribute("hidden");
    return;
  }
  document.getElementById("print-error").setAttribute("hidden", "true");
  const jobNumberField = document.getElementById("job-number-print");
  const reviewField = document.getElementById("review-number-print");

  var printModal = checklistVariables.printModal;
  printModal.hide();
  printModal.dispose();

  document.getElementById("job-number").innerHTML = jobNumberField.value;
  document.getElementById("review-number").innerHTML = reviewField.value;

  checklistVariables.validPass = true;

  window.print();

  checklistVariables.validPass = false;
}

function verifyPrintInputs() {
  const jobNumber = document.getElementById('job-number-print');
  const revisionNumber = document.getElementById('review-number-print');
  const includeComments = document.getElementById('include-comments');
  const reviewerName = document.getElementById('reviewer');
  const comments = document.getElementById('comment-text');

  var returnComments = [];
  
  if (jobNumber.value == "") {
    returnComments.push("The job number cannot be empty.");
  }
  
  if (revisionNumber.value == "") {
    returnComments.push("The review number cannot be empty.");
  }
  else {
    const revisionNumberValue = Number.parseInt(revisionNumber.value);
    if (revisionNumberValue < 1) {
      returnComments.push("The review number cannot be less than 1 and must be a number.");
    }
  }

  if (includeComments.checked) {
    if (reviewerName.value == "") {
      returnComments.push("The reviewer name cannot be empty.");
    }
    
    if (comments.value == "") {
      returnComments.push("You must provide a value in the comment section.");
    }
  }

  return returnComments;
}

// #endregion

// #region Save URL

function getSaveLink() {
  console.log("starting save url generation.");

  const htmlLink = document.getElementById("save-link");
  var buttonStatus = getPassingString();
  console.log(buttonStatus);
  var linkText = window.location.href.split('#')[0].split('?')[0];
  

  var date = new Date();

  linkText += "?reload=true&checkstatus=" + buttonStatus;
  linkText += "&created=" + date.toISOString();

  htmlLink.value = linkText;

  const jobNumber = document.getElementById("job-number-print").value;
  const reviewNumber = document.getElementById("review-number-print").value;
  const reviewerName = document.getElementById("reviewer").value;

  if (jobNumber != "") {
    linkText += "&jobNumber=" + jobNumber;
  }

  if (reviewNumber != "") {
    linkText += "&review=" + reviewNumber;
  }
  
  if (reviewerName != "") {
    linkText += "&reviewerName=" + reviewerName;
  }

  document.getElementById('save-link').value = encodeURI(linkText);
}

function confirmSaveLink() {
  const urlLink = document.getElementById('save-link').value;
  navigator.clipboard.writeText(urlLink);

  const toastLiveExample = document.getElementById('toast-link-success')
  const toast = new bootstrap.Toast(toastLiveExample);
  toast.show();
}

// #endregion

//#region Utilities

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

function resetAllChecks() {
  const radios = document.querySelectorAll('input[type=radio][checked]');
  var confirmReset = confirm("Are you sure you wish to reset this form. Any inputs will be lost.");
  if (confirmReset) {
    radios.forEach(element => {
      element.checked = true;
    });

    const toastLiveExample = document.getElementById('toast-reset-success')
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
  }
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

// #endregion