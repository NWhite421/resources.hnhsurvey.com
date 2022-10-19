$().ready(function() {
  updateLabels("general");

  $("#areaSelect").change(function() {
    var area = $(this).find('option:selected').attr("data-int-area");
    console.debug(area);

    updateLabels(area);
  });
});

function updateLabels(area) {
  let newStr = "General Requirement";

  switch (area) {
    case "palmBay": {newStr = "City of Palm Bay"; break;}
    default: {break;}
  }

  let areas = $('p[data-int-area]').html(newStr);
  console.debug(areas.length)
}