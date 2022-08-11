var checklistVariables = {};

window.addEventListener("beforeprint", event => {
  console.log(checklistVariables.validPass);
  if (checklistVariables.validPass == null || checklistVariables.validPass != true)
  {
    alert("Please use the \"Print Copy\" under the table of contents to print correctly.");
  }
  // do something
});

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

  printModal = checklistVariables.printModal;
  printModal.hide();

  document.getElementById("job-number").innerHTML = jobNumberField.value;
  document.getElementById("review-number").innerHTML = reviewField.value;

  checklistVariables.validPass = true;

  window.print();

  checklistVariables.validPass = false;
}