var mymap = L.map('mapid').setView([-39.542321, 176.672763], 10);

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FuenVrIiwiYSI6ImNpcjhlNmltdTAwenRnN20zZzJnaGY2eW0ifQ.V53-PWoukCQNhbBG-cf2tw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(mymap);
