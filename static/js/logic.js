// logic.js

document.addEventListener('DOMContentLoaded', function () {
    // mpa instance
    var map = L.map('map').setView([0, 0], 2);
  
    // tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
  
    // getting info
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // analysis
        var earthquakes = data.features;
  
        // markers
        var markerOptions = {
          radius: 5, // default size
          fillColor: 'orange',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        };
  
        // adding markers
        earthquakes.forEach(function (earthquake) {
          var lat = earthquake.geometry.coordinates[1];
          var lng = earthquake.geometry.coordinates[0];
          var mag = earthquake.properties.mag;
          var depth = earthquake.geometry.coordinates[2];
          var title = earthquake.properties.title;
  
          // setting marker size to match magnitude
          markerOptions.radius = mag * 2;
  
          // marker color for depth
          markerOptions.fillColor = getMarkerColor(depth);
  
          // marker at the earthquake's location
          var marker = L.circleMarker([lat, lng], markerOptions).addTo(map);
  
          // marker popup
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
  
        // legend
        var legend = L.control({ position: 'bottomright' });
  
        // setting legend colors
        legend.onAdd = function () {
          var div = L.DomUtil.create('div', 'info legend');
          var depthRanges = ['0-10', '11-30', '31-50', '51+'];
          var colors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B'];
  
          // legend HTML
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
  
        // putting legend on map
        legend.addTo(map);
      })
      .catch(function (error) {
        console.log('Error:', error);
      });
  });
  
  // marker color based on depth. Instructions did not specify quantile so used basic separation colors
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
  