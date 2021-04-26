

var sourceURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZh1p5c6wLl1A3ir81WmupVlzOUr3MPGjMbV9F42HRu_XrKXUOu2wOu_WQPOIr4Am5aiu_heGT3AM1/pub?gid=0&single=true&output=csv";
// var sourceCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQT__zrhQJOU62on5s9HpJk-1TTK0XcSmeb_KLlDhssVKJot-wBhY0niLwsKmUDt4fz6x_53fTDLchE/pub?gid=0&single=true&output=csv";
d3.csv(sourceURL, function(error, data) {
  if (error) throw error;

  var programNames = [],
      matrix = [];
  
  data.forEach( function(d) {
    programNames.push(d.progName);
    tmp = [];
    for (var i = 0; i < data.length; i++) {
      tmp.push(d[i]);
    }
    matrix.push(tmp);
  });

  // console.log(programNames);
  // console.log(matrix);

  var fill = function(d) {
    return "hsl(" + parseInt(d.index / programNames.length * 360, 10) + ",95%,65%)";
  };

  var fade = function(opacity) {
    return function(d, i) {
      svg.selectAll("path.chord")
          .filter(function(d) { return d.source.index != i && d.target.index != i; })
      .transition()
          .style("stroke-opacity", opacity)
          .style("fill-opacity", opacity);
    };
  };

  var margin = {top: 30, right: 25, bottom: 30, left: 25},
      width = 800 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom,
      padding = 0.04,
      innerRadius = Math.min(width, height) * 0.29,
      outerRadius = innerRadius * 1.06;
  
  var svg = d3.select("#dw_placeholder")
              .append("svg:svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("svg:g")
                .attr("transform", "translate(" + (margin.left + (width / 2)) + "," + (margin.top + (height / 2)) + ")");
  
                console.log(matrix);
  
  var programNames = [
        'Metro Data Science', 'Natural Resources & Hazards', 'Health', 'Data-Enabled Discovery', 'Data Storytelling',
        'Driver Video Privacy Challenge', 'DSSG Projects', 'Border Solutions Alliance Challenge',
        'Open Water Data Challenge', 'Natural Resources Workshops', 'Climate Indicators' ];
  var testData = [
        [0, 0, 0, 0, 2, 1, 1, 2, 1, 2, 1],
        [0, 0, 0, 0, 1, 2, 1, 1, 3, 3, 1],
        [0, 0, 0, 0, 2, 1, 1, 3, 2, 4, 1],
        [0, 0, 0, 0, 4, 1, 1, 3, 1, 3, 4],
        [1, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 2, 4, 1, 0, 0, 0, 0, 0, 0, 0],
        [3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
        [2, 4, 3, 2, 0, 0, 0, 0, 0, 0, 0],
        [4, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 3, 2, 0, 0, 0, 0, 0, 0, 0],
        [2, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0] ]; // 11
        
  var chord = d3.layout.chord()
                       .padding(padding)
                       .sortSubgroups(d3.descending)
                       .sortChords(d3.descending)
                       .matrix(testData);
  
  var arc = d3.svg.arc()
                  .innerRadius(innerRadius)
                  .outerRadius(outerRadius);
  
  var g = svg.selectAll("g.group")
             .data(chord.groups)
             .enter().append("svg:g")
             .attr("class", function(d) { return "group " + programNames[d.index]; });

  g.append("svg:path") // draw outer arcs
   .attr("class", "arc")
   .style("fill", fill)
   .style("stroke", fill)
   .attr("d", arc)
   .on("mouseover", fade(0.1))
   .on("mouseout", fade(1));
  
  g.append("svg:text") // initiate programNames
   .each( function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
   .attr("dy", "0.35em")
   .attr("class", "titles")
   .attr("text-anchor", function(d) { return d.angle > (Math.PI * 0.9) ? "end" : null; })
   .attr("transform", function(d) {
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + 
           "translate(" + (innerRadius + 20) + ")" + 
           (d.angle > (Math.PI * 0.9) ? "rotate(180)" : "");
   })
   .attr("fill", "black")
   .attr("font-size", 12)
   .attr("font-family", "Rosario")
   .style("opacity", 0)
   .transition().duration(800)
   .style("opacity", 1)
   .text(function(d) { return programNames[d.index] });

  var chords = svg.selectAll("path.chord")
                  .data(chord.chords)
                  .enter().append("svg:path")
                  .attr("class", "chord")
                  .style("stroke", function(d) { return d3.rgb(fill(d.source)).darker(); })
                  .style("fill", function(d) { return fill(d.source); })
                  .attr("d", d3.svg.chord().radius(innerRadius))
                  .style("opacity", 0)
                  .transition().duration(2500)
                  .style("opacity", 1);


});
