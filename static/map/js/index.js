// http://geojson.io/#id=gist:anonymous/be637cef78ca36593bff&map=16/24.8124/121.0200

L.mapbox.accessToken = 'pk.eyJ1IjoicmljaG8yMTkyMDAwIiwiYSI6IlZvXzliM2sifQ.Y8PDWJ0c6a60BlQkir9BQQ';
var t_json = {
	"tiles": [ "https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicmljaG8yMTkyMDAwIiwiYSI6IlZvXzliM2sifQ.Y8PDWJ0c6a60BlQkir9BQQ" ],
	"minzoom": 15,
	"maxzoom": 15
}

// Initialization
var map = L.mapbox.map('map', t_json)
.setView([24.8028, 121.0111], 15);

var svg = d3.select(map.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

// Rendering points and path
d3.json("geodata", function(collection) {
	
	var featuresdata = collection.features.filter(function(d) {
		return d.properties.id == "route"
	})

	console.log(featuresdata);

	var transform = d3.geo.transform({
		point: projectPoint
	});
	var d3path = d3.geo.path().projection(transform);

	function projectPoint(x, y) {
		var point = map.latLngToLayerPoint(new L.LatLng(y, x));
		this.stream.point(point.x, point.y);
	}

	var toLine = d3.svg.line()
		.interpolate("linear")
		.x(function(d) {
			return applyLatLngToLayer(d).x
		})
		.y(function(d) {
			return applyLatLngToLayer(d).y
		});

	function applyLatLngToLayer(d) {
		console.log(d);
		var y = d.geometry.coordinates[1]
		var x = d.geometry.coordinates[0]
		return map.latLngToLayerPoint(new L.LatLng(y, x))
	}

	// here is the line between points
	var linePath = g.selectAll(".lineConnect")
		.data([featuresdata])
		.enter()
		.append("path")
		.attr("class", "lineConnect");


	// This will be our traveling circle
	var marker = g.append("circle")
		.attr("r", 10)
		.attr("id", "marker")
		.attr("class", "travelMarker")
		.style("fill", "#01814A");

	// if you want the actual points change opacity
	var ptFeatures = g.selectAll("circle")
		.data(featuresdata)
		.enter()
		.append("circle")
		.attr("r", 3)
		.attr("class", function(d){
			return "waypoints " + "c" + d.properties.time
		})
		.style("opacity", 0);

	// I want the origin and destination to look different
	var originANDdestination = [featuresdata[0], featuresdata[featuresdata.length-1]]

	var begend = g.selectAll(".drinks")
		.data(originANDdestination)
		.enter()
		.append("circle", ".drinks")
		.attr("r", 5)
		.style("fill", "red")
		.style("opacity", "1");

	var text = g.selectAll("text")
		.data(originANDdestination)
		.enter()
		.append("text")
		// .text(function(d) {
		// 	return d.properties.name
		// })
		.attr("class", "locnames")
		.attr("y", function(d) {
			return -10 //I'm moving the text UP 10px
		})

	map.on("viewreset", reset);

	// this puts stuff on the map! 
	reset();
	transition();

	function reset() {
		var bounds = d3path.bounds(collection),
			topLeft = bounds[0],
			bottomRight = bounds[1];


		begend.attr("transform",
			function(d) {
				return "translate(" +
					applyLatLngToLayer(d).x + "," +
					applyLatLngToLayer(d).y + ")";
		});

		svg.attr("width", bottomRight[0] - topLeft[0] + 120)
			.attr("height", bottomRight[1] - topLeft[1] + 120)
			.style("left", topLeft[0] - 50 + "px")
			.style("top", topLeft[1] - 50 + "px");


		linePath.attr("d", toLine);
		g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");


	} // end reset

	function transition() {
		linePath.transition()
			.duration(7500)
			.attrTween("stroke-dasharray", tweenDash)
			.each("end", function() {
				d3.select(this).call(transition);// infinite loop
				ptFeatures.style("opacity", 0)
			});
	} 

	function tweenDash() {

		return function(t) {
			// In original version of this post the next two lines of JS were
			// outside this return which led to odd behavior on zoom
			// Thanks to Martin Raifer for the suggested fix.

			//total length of path (single value)
			var l = linePath.node().getTotalLength(); 
			interpolate = d3.interpolateString("0," + l, l + "," + l); 

			//t is fraction of time 0-1 since transition began
			var marker = d3.select("#marker");
			
			// p is the point on the line (coordinates) at a given length
			// along the line. In this case if l=50 and we're midway through
			// the time then this would 25.
			var p = linePath.node().getPointAtLength(t * l);

			//Move the marker to that point
			marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker
			return interpolate(t);
		}
	}

});