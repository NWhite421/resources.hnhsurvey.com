/*
 * File: general.js
 * Path: \js
 * Project: HNH Resources Website
 * Created Date: 08-11-2022 19-53-07
 * Author: Nathan White
 * -----
 * Last Modified: 08-13-2022 12-18-35
 * Modified By: Nathan White
 * -----
 * Copyright (c) 2022 Exacta Land Surveying
 */

window.addEventListener("load", onLoad);
window.addEventListener("beforeprint", onPagePrint);
window.addEventListener("afterprint", onPageFinishPrint)

function onLoad() {
  var today = getDate()

  const date = new Date();
  setCookie("lastVisit", date.toISOString(), 365)

  autofillAreas();

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.getElementById('color-theme').href = "https://cdn.jsdelivr.net/npm/bootswatch@5.2.0/dist/darkly/bootstrap.min.css";
  }
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
  if (isPrintFriendly == "none") {
    alert("You are printing a page not configured for paper. Content may or may not display correctly.")
  }

  var element = document.getElementById('color-theme');
  element.setAttribute("disabled", "true");
}

function onPageFinishPrint() {
  var element = document.getElementById('color-theme');
  element.removeAttribute("disabled");
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