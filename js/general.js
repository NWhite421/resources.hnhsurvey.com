window.addEventListener("load", onLoad);
window.addEventListener("beforeprint", onPagePrint);

function onLoad() {
  var today = getDate()

  const dateString = today[0] + "/" + today[1] + "/" + today[2];
  setCookie("lastVisit", dateString, 365)

  autofillAreas();
}

function autofillAreas() {
  var today = getDate()

  var items = document.querySelectorAll("[autofill]");
  
  for (let index = 0; index < items.length; index++) {
    var element = items[index];
    console.log(element);

    var innerHtml = element.innerHTML;
    console.log("before: " + innerHtml)
    innerHtml = innerHtml.replace("[year]", today[2]);
    
    console.log("after: " + innerHtml)

    element.innerHTML = innerHtml;
  }
}

function onPagePrint() {
  var isPrintFriendly = document.querySelector('meta[name="print-friendly"]').content;
  if (isPrintFriendly == "false") {
    alert("You are printing a page not configured for paper. Content may or may not display correctly.")
  }
}

function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var hh = String(today.getHours()).padStart(2, '0');
  var min = String(today.getMinutes()).padStart(2, '0');
  var sec = String(today.getSeconds()).padStart(2, '0');
  return [mm, dd, yyyy, hh, min, sec];
}

function convertTextareaToHTML(textArea) {
  var input = textArea;
  console.log(input);
  var lines = input.split('\n');
  var html = '';
  for (var i = 0; i < lines.length; i++) {
    html += '<p class="my-1">' + lines[i] + '</p>';
  }
  return html;
}

// #region Cookie Management

function setCookie(cookieName, cookieValue, expireDays) {
  const date = new Date();
  date.setTime(date.getTime() + (expireDays*24*60*60*1000));
  let expireDate = date.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";expires=" + expireDate + ";path=/;SameSite=Strict";
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookielist = decodedCookie.split(';');
  for (var i = 0; i < cookielist.length; i++) {
    var cookie = cookielist[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, c.length);
    }
  }
  return "";
}

// #endregion