var d3 = require('d3');
var topojson = require('topojson');
var io = require('socket.io-client');

var socket = io.connect('localhost:8000');

socket.on('news', function (data) {
  console.log(data);
  socket.emit('reply', {
   
  });
});

var containerWidth = "100%";
var width = 960;
var height = 500;

var svg = d3.select("svg")
  .attr("width",containerWidth)
  .attr("height", height);

var projection = d3.geoOrthographic()
  .scale(width / 4)
  .translate([width / 2, height / 2])

var path = d3.geoPath()
  .projection(projection);

var backgroundCircle = svg.append("circle")
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', projection.scale())
  .attr('class', 'globe');

var url = "./src/world110.topojson";
d3.json(url)
  .then(function (world) {

    var countries = topojson.feature(world, world.objects.countries).features;
    svg.append("g")
      .selectAll("path", ".country")
      .data(countries).enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path);
  });