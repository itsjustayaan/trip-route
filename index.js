let map;
let markers = [];
let Paths = [];
let selectedLocation = [];
let isPresent = false;
let modeTravel = "car";

function initMap() {
  let location = { lat: 26.924150519735488, lng: 80.95402479171754 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: location,
  });
  map.addListener("click", async (mapsMouseEvent) => {
    let marker = new google.maps.Marker({
      position: mapsMouseEvent.latLng,
      map: map,
    });
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${marker.position.lat()}&lon=${marker.position.lng()}&format=json`;
    let mark;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const address = data.display_name;
      mark = await assignAddress(address);
    } catch (error) {
      console.error(error);
    }
    markers[mark] = marker;
  });
}
window.initMap = initMap;

$(document).ready(function () {
  $("#makeRoute").on("click", async function () {
    let addresses = {
      address: [],
      latLang: [],
      plotPoints: [],
    };
    if (Paths.length > 0) Paths.pop().setMap(null);

    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    let start = $("#start").val();
    addresses.address.push(start);

    $(".inputTag").each(function () {
      addresses.address.push($(this).children("input").val());
    });

    let end = $("#end").val();
    addresses.address.push(end);

    for (const address of addresses.address) {
      try {
        const encodedAddress = encodeURIComponent(address);
        const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.length > 0) {
          const result = data[0];

          let latLang = {
            lng: parseFloat(result.lon),
            lat: parseFloat(result.lat),
          };

          let marker = new google.maps.Marker({
            position: latLang,
            map: map,
          });

          addresses.latLang.push(latLang);
          addresses.plotPoints.push([latLang.lng, latLang.lat]);
          markers.push(marker);
        } else {
          console.log(`No results found for the address: ${address}`);
        }
      } catch (error) {
        console.error(
          `Error occurred while geocoding address: ${address}`,
          error
        );
      }
    }
    const data = await drawRoute(addresses.plotPoints);
    let plotlines = [];
    await data.paths[0].points.coordinates.forEach((coordinate) => {
      plotlines.push({ lat: coordinate[1], lng: coordinate[0] });
    });
    const makePath = await new google.maps.Polyline({
      path: plotlines,
      geodesic: true,
      strokeColor: "#E57C23",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    makePath.setMap(map);
    Paths.push(makePath);
    await $("#" + modeTravel).css("color", "black");
    map.setCenter({
      lat: addresses.latLang[0].lat,
      lng: addresses.latLang[0].lng,
    });
    await setContent(modeTravel, data.paths[0].distance, data.paths[0].time);
    map.setZoom(8);
  });
});

$(".vehicle").on("click", function () {
  $(".vehicle").css("color", "#67676c");
  modeTravel = $(this).attr("id");
  $("#" + modeTravel).css("color", "black");
});

async function drawRoute(latLang) {
  const query = new URLSearchParams({
    key: "39bf67bf-9dcb-4a43-8c43-e14a86224002",
  }).toString();

  const resp = await fetch(`https://graphhopper.com/api/1/route?${query}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      points: latLang,
      vehicle: modeTravel,
      locale: "en",
      instructions: true,
      calc_points: true,
      points_encoded: false,
    }),
  });
  const data = await resp.json();
  return data;
}

async function setContent(by, dist, time) {
  by = by.charAt(0).toUpperCase() + by.slice(1);
  time = await formatTime(time);
  if (dist / 1000 < 1) dist = dist.toFixed(2) + " m";
  else dist = (dist / 1000).toFixed(2) + " km";
  $("#by").text("By: " + by);
  $("#dist").text("Distance: " + dist);
  $("#time").text("ETA: " + time);
}

async function formatTime(milliseconds) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
  const days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);

  if (days === 0 && hours === 0 && minutes === 0) {
    return `${seconds} sec`;
  } else if (days === 0 && hours === 0) {
    return `${minutes} min ${seconds} sec`;
  } else if (days === 0) {
    return `${hours} hr ${minutes} min ${seconds} sec`;
  } else {
    return `${days} days ${hours} hr ${minutes} min ${seconds} sec`;
  }
}
