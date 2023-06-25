let n = 2;
$("document").ready(function () {
  $("#addStops").on("click", function () {

    var inputId = "inputdiv_" + n;
    var input = $(
      '<div class="inputTag" id="' +
        inputId +
        '"><input type="text" placeholder="In Between"><span class="material-icons remove-icon">remove</span></div>'
    );
    $("#innerContainer").append(input);
    n++;
  });
  $("#innerContainer").on("click", ".remove-icon", function () {
    var inputTagId = $(this).parent(".inputTag").attr("id");
    var index = inputTagId.indexOf("_");
    var inputNumber = inputTagId.substring(index + 1);

    if (markers[inputNumber] != undefined) {
      markers[inputNumber].setMap(null);
      markers.splice(inputNumber, 1);
    }

    $("#" + inputTagId).remove();
  });
});
async function assignAddress(address) {
  var inputId = "inputdiv_" + n;
  var input = $(
    '<div class="inputTag" id="' +
      inputId +
      '"><input type="text" placeholder="In Between" value="' +
      address +
      '"><span class="material-icons remove-icon">remove</span></div>'
  );
  $("#innerContainer").append(input);
  return n++;
}
