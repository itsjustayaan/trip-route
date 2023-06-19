$("document").ready(function () {
    let n=1;
    $("#addStops").on("click", function () {
      var inputId = "inputdiv_" + n; 
      var input = $('<div class="inputTag" id="'+inputId+'"><input type="text" placeholder="Enter value"><span class="material-icons remove-icon">remove</span></div>');
      $("#innerContainer").append(input);
      n++;
    });
    $("#innerContainer").on("click", ".remove-icon", function() {
        var inputTagId = $(this).parent(".inputTag").attr("id");
        $("#" + inputTagId).remove();
      });
  });
