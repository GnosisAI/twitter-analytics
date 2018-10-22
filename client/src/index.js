var d3 = require('d3');
var topojson = require('topojson');
var io = require('socket.io-client');
var dataset = require('./mock');


var socket = io.connect('localhost:8000');

socket.on('news', function (data) {
    console.log(data);
    socket.emit('reply', {});
});

var containerWidth = "100%";
var width = 960;
var height = 500;

var zoom = d3.zoom()
    // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
    // .translate([0, 0]) 
    // .scale(1) 
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

function zoomed() {
    g.attr("transform", d3.event.transform);
    backgroundCircle.attr("transform", d3.event.transform);
}

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)
    .on("mousedown.zoom", null);

var config = {
    speed: 0.005,
    verticalTilt: -30,
    horizontalTilt: 0
}
enableRotation();
var projection = d3.geoOrthographic()
    .scale(width / 4)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

function enableRotation() {
    d3.timer(function (elapsed) {
        projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
        svg.selectAll("path").attr("d", path);
    });
}
var url = "./src/world110.topojson";
d3.json(url)
    .then(function (world) {

        backgroundCircle = svg.append("circle")
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', projection.scale())
            .attr('class', 'globe');

        g = svg.append("g");
        var countries = topojson.feature(world, world.objects.countries).features;
        g.selectAll("path", ".country")
            .data(countries).enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path);
    });