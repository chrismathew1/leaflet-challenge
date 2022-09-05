// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.

  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(data);

});

// 2. 
function createFeatures(data) {

  console.log(data)

  function onEachFeature(feature, layer) {

    //layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag}`)

  }
  // Save the earthquake data in a variable.

  earthquake_points = []

  //console.log(data.features[10].geometry.coordinates[0])
  
  for (var i = 0; i < data.features.length; i++) {
    earthquake_points.push(
        L.circleMarker(data.features[i].geometry.coordinates.slice(0,2).reverse(), {
        stroke: true,
        fillOpacity: 1,
        color: "black", //getColor(data.features[i].geometry.coordinates[2]),
        fillColor: getColor(data.features[i].geometry.coordinates[2]),
        radius: markerSize(data.features[i].properties.mag)
      }).bindPopup(`<h3>Magnitude: ${data.features[i].properties.mag}</h3> <hr> <h3>Depth: ${data.features[i].geometry.coordinates[2]}</h3>`)
    );
    //console.log(data.features[i].geometry.coordinates[2])
  }

  //console.log("eq's: ", earthquake_points);
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ['200', '100', '75', '50', '35', '20', '10', '5'].reverse();
    var colors = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'];
    var labels = [];

    // Add the minimum and maximum.
    var legendInfo = "<h1>Depth</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    for (var i = 0; i < limits.length; i++) {
        div.innerHTML +=
                '<li style="background:' + colors[i] + '">' + limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+') +'</li> ';
                ;
    }

 
    return div;
  };




  var earthquakes = L.layerGroup(earthquake_points);


  createMap(earthquakes, legend);

}

function getColor(d) {
    return d > 200 ? '#800026' :
           d > 100 ? '#bd0026' :
           d > 75  ? '#e31a1c' :
           d > 50  ? '#fc4e2a' :
           d > 35  ? '#fd8d3c' :
           d > 20  ? '#feb24c' :
           d > 10  ? '#fed976' :
           d > 5   ? '#ffeda0' :
                     '#ffffcc';
}


// A function to determine the marker size based on the population
function markerSize(mag) {
    return mag*6;
  }
  

// 3.
// createMap() takes the earthquake data and incorporates it into the visualization:

function createMap(earthquakes, legend) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Creat an overlays object.
  var overlayMaps = {
    "Earthquakes": earthquakes

  }

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  legend.addTo(myMap);

}

