function initMap() {
  let location = { lat: 26.924150519735488, lng: 80.95402479171754 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: location,
  });
}
window.initMap = initMap;
$(document).ready(function () {
  $("#makeRoute").on("click", function () {
    let start = $("#start").val();
    let end = $("#end").val();
    let stops = [];
    $(".inputTag").each(function () {
      stops.push($(this).children("input").val());
    });
  });
});
