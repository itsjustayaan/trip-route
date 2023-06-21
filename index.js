let map;
let markers = [];
function initMap() {
  let location = { lat: 26.924150519735488, lng: 80.95402479171754 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: location,
  });
}
window.initMap = initMap;
$(document).ready(function () {
  $("#makeRoute").on("click", function () {

    let addresses = [];
    let selectedLocation = [];
    
    let start = $("#start").val();
    addresses.push(start);
    let end = $("#end").val();
    $(".inputTag").each(function () {
      addresses.push($(this).children("input").val());
    });
    addresses.push(end);
    
    addresses.forEach((address) => {
      const encodedAddress = encodeURIComponent(address);
      const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const result = data[0];

            let latLang = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };

            let marker = new google.maps.Marker({
              position: latLang,
              map: map,
              draggable: true,
            });

            marker.addListener("dragend", (markerDragEvent) => {
              let index = markers.indexOf(marker);
              selectedLocation[index] = markerDragEvent.latLng.toJSON();
            });

            marker.addListener("dblclick", () => {
              let index = markers.indexOf(marker);
              markers.splice(index, 1);
              selectedLocation.splice(index, 1);
              marker.setMap(null);
            });
            
            selectedLocation.push(latLang);
            markers.push(marker);

          } else {
            console.log(`No results found for the address: ${address}`);
          }
        })
        .catch((error) => {
          console.error(
            `Error occurred while geocoding address: ${address}`,
            error
          );
        });
    });
  });
});
