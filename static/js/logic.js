// logic.js

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Create a map instance and set its center and zoom level
    var map = L.map('map').setView([0, 0], 2);
  
    // Create a tile layer to add to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
  
    // Fetch earthquake data from the USGS API
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Process the earthquake data
        var earthquakes = data.features;
  
        // Define marker options for size and color
        var markerOptions = {
          radius: 5, // default size
          fillColor: 'orange',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        };
  
        // Loop through the earthquakes and add markers to the map
        earthquakes.forEach(function (earthquake) {
          var lat = earthquake.geometry.coordinates[1];
          var lng = earthquake.geometry.coordinates[0];
          var mag = earthquake.properties.mag;
          var depth = earthquake.geometry.coordinates[2];
          var title = earthquake.properties.title;
  
          // Adjust marker size based on magnitude
          markerOptions.radius = mag * 2;
  
          // Adjust marker color based on depth
          markerOptions.fillColor = getMarkerColor(depth);
  
          // Create a marker at the earthquake's location with the customized options
          var marker = L.circleMarker([lat, lng], markerOptions).addTo(map);
  
          // Set the marker's popup content
          marker.bindPopup(
            '<b>Title:</b> ' +
              title +
              '<br><b>Magnitude:</b> ' +
              mag +
              '<br><b>Depth:</b> ' +
              depth +
              ' km'
          );
        });
  
        // Create a legend control
        var legend = L.control({ position: 'bottomright' });
  
        // Function to generate the legend HTML content
        legend.onAdd = function () {
          var div = L.DomUtil.create('div', 'info legend');
          var depthRanges = ['0-10', '11-30', '31-50', '51+'];
          var colors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B'];
  
          // Generate HTML for the legend
          var html = '<h4>Depth</h4>';
          for (var i = 0; i < depthRanges.length; i++) {
            html +=
              '<div><span class="legend-color" style="background-color:' +
              colors[i] +
              '"></span>' +
              depthRanges[i] +
              ' km</div>';
          }
  
          div.innerHTML = html;
          return div;
        };
  
        // Add the legend to the map
        legend.addTo(map);
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  });
  
  // Function to calculate the marker color based on depth
  function getMarkerColor(depth) {
    var color;
  
    if (depth <= 10) {
      color = '#FF5722';
    } else if (depth <= 30) {
      color = '#FF9800';
    } else if (depth <= 50) {
      color = '#FFC107';
    } else {
      color = '#FFEB3B';
    }
  
    return color;
  }
  