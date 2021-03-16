d3.chart = d3.chart || {};

var margin = {top: 20, right: 20, bottom: 30, left: 30},
    width = 750 - (margin.left + margin.right),
    height = 550 - (margin.top + margin.bottom);

var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height/2, -height/2]);

var posarea = d3.area()
  .x(function(d) { return x(d.date); })
  .y0(height/2)
  .y1(function(d) { return y(d.value); })
  .curve(d3.curveBasis);

var posline = d3.line()
  .x(function(d) { return x(d.date) })
  .y(function(d) { return y(d.value) })
  .curve(d3.curveBasis);

var negarea = d3.area()
  .x(function(d) { return x(d.date) })
  .y0(function(d) { return y(d.rev*-1); })
  .y1(height/2)
  .curve(d3.curveBasis);

var negline = d3.line()
  .x(function(d) { return x(d.date) })
  .y(function(d) { return y(d.rev*-1) })
  .curve(d3.curveBasis);

var svg = d3.select("#chart_placeholder")
  .append("svg")
  .attr("width", width + (margin.left + margin.right))
  .attr("height", height + (margin.top + margin.bottom))
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGB6_3jLSUmHSwNgriQlGSgTyqfEmaTQtD9g-pyRgcm0cSRFCQXv1lxQlhZNl6oy4PZuwEC-UzX3iR/pub?gid=0&single=true&output=csv";
d3.csv(dataUrl, function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.date = parseTime(d.date);
    d.value = +d.value-75;
    d.rev = +d.revenue;
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value*2 })]);

  svg.append("path")
    .data([data])
    .attr("class", "posarea")
    .attr("d", posarea);

  svg.append("path")
    .data([data])
    .attr("class", "posline")
    .attr("d", posline);
  
  svg.append("path")
    .data([data])
    .attr("class", "negarea")
    .attr("d", negarea);

  svg.append("path")
    .data([data])
    .attr("class", "negline")
    .attr("d", negline);
  
  svg.append("g")
    .attr("transform", "translate(0," + height/2 + ")")
    .call(d3.axisBottom(x));
  
  // svg.append("g")
  //   .call(d3.axisLeft(y));
});
