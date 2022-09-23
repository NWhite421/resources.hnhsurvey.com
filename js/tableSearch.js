/*
 * File: tableSearch.js
 * Path: \js
 * Project: HNH Resources Website
 * Created Date: 08-17-2022 19-54-01
 * Author: Nathan White
 * -----
 * Last Modified: 08-17-2022 20-09-11
 * Modified By: Nathan White
 * -----
 * Copyright (c) 2022 Exacta Land Surveying
 */

$(document).ready(function () {

  // Filters the <tbody> element based on the contents of the input "searchBox"
  $("#searchBox").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableContent tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Clears the content and triggers the input "searchBox" keyup event (see above)
  $("#clearSearch").click(function () {
    $("#searchBox").val("").trigger("keyup");
  });

  $('th').click(function () {
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc) { rows = rows.reverse() }
    for (var i = 0; i < rows.length; i++) { table.append(rows[i]) }
  })
  function comparer(index) {
    return function (a, b) {
      var valA = getCellValue(a, index), valB = getCellValue(b, index)
      return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
  }
  function getCellValue(row, index) { return $(row).children('td').eq(index).text() }
});