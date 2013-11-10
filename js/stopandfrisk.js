var map = L.map('map').setView([40.7, -73.9], 11);

var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
	//attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
	key: 'BC9A493B41014CAABB98F0471D759707',
	styleId: 22677
}).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>NYPD Stop and Frisk Data 2003-2011</h4>' +  
			(props ? '<b>' + props.name + '</b><br />' 
			+ props.total + ' people stopped<br/>' 
			+ props.percArrestsFromStops + ' % arrested <br />'  
			+ props.percSummonsFromStops + ' % summoned <br />'  
			+ props.percNotArrestedOrSummonedFromStops 
			+ ' % Not Arrested or Summoned from Stops <br />' 
			+ '<br /><h4>Demographics</h4>' 
			+ (props.black / props.total) * 100 + '% Blacks <br />' 
			+ (props.numbWhite / props.total) * 100 + '% Whites <br />' 
			+ (props.blackHispanic / props.total) * 100 + '% Black-Hispanic <br />' 
			+ (props.whiteHispanic / props.total) * 100 + '% White-Hispanic <br />' 
			+ (props.asian / props.total) * 100 + '% Asian <br />'     
			: 'Hover over a precinct');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
	return d > 20000  ? '#081D58' :
	       d > 10000  ? '#253494' :
	       d > 5000   ? '#225EA8' :
	       d > 4000   ? '#1D91C0' :
	       d > 3000   ? '#41B6C4' :
	       d > 2000   ? '#7FCDBB' :
	       d > 1000   ? '#C7E9B4' :
	                    '#EDF8B1' ;
}

// hover over multiple areas then show
function style(feature) {
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.total)
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

geojson = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);

//map.attributionControl.addAttribution();


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 1000, 2000, 3000, 4000, 5000, 10000],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);


$(".price").mouseover(function() {
	$(".items").css("opacity", 0.4); 
	  id = $(this).attr('id');
	$("."+id).css("opacity", 1);
		}).mouseleave(function() { 
		    id = $(this).attr('id');
	$("."+id).css("opacity", 0.4);
});
