/** 
 * @author Brian Yang
 * @lastUpdate 04/26/2021
 * @reference https://www.d3-graph-gallery.com/chord
 * 
*/


var sourceURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZh1p5c6wLl1A3ir81WmupVlzOUr3MPGjMbV9F42HRu_XrKXUOu2wOu_WQPOIr4Am5aiu_heGT3AM1/pub?gid=0&single=true&output=csv";

d3.csv(sourceURL, function(error, data) {
  if (error) throw error;

  var programNames = [],
      matrix = [];
  
  data.forEach( function(d) {
    programNames.push(d.progName);
    tmp = [];
    for (var i = 0; i < data.length; i++) {
      tmp.push(parseInt(d[i])); // remember to use parseInt() because all int are read as str
    }
    matrix.push(tmp);
  });

  console.log(programNames);
  console.log(matrix);

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
  
  // var testData = [ // equal sized arcs (10 per program)
  //   [0, 0, 0, 0, 2, 1, 1, 2, 1, 2, 1],
  //   [0, 0, 0, 0, 10/12, 20/12, 10/12, 10/12, 30/12, 30/12, 10/12],
  //   [0, 0, 0, 0, 20/14, 10/14, 10/14, 30/14, 20/14, 40/14, 10/14],
  //   [0, 0, 0, 0, 40/17, 10/17, 10/17, 30/17, 10/17, 30/17, 40/17],
  //   [10/6, 10/6, 30/6, 10/6, 0, 0, 0, 0, 0, 0, 0],
  //   [10/8, 20/8, 40/8, 10/8, 0, 0, 0, 0, 0, 0, 0],
  //   [30/9, 20/9, 20/9, 20/9, 0, 0, 0, 0, 0, 0, 0],
  //   [20/11, 40/11, 30/11, 20/11, 0, 0, 0, 0, 0, 0, 0],
  //   [30/9, 40/9, 10/9, 10/9, 0, 0, 0, 0, 0, 0, 0],
  //   [10/7, 10/7, 30/7, 20/7, 0, 0, 0, 0, 0, 0, 0],
  //   [20/7, 10/7, 10/7, 30/7, 0, 0, 0, 0, 0, 0, 0]
  // ];


  var chord = d3.layout.chord()
                       .padding(padding)
                       .sortSubgroups(d3.descending)
                       .sortChords(d3.descending)
                       .matrix(matrix);
  
  var arc = d3.svg.arc()
                  .innerRadius(innerRadius)
                  .outerRadius(outerRadius);
  
  var g = svg.selectAll("g.group")
             .data(chord.groups)
             .enter()
             .append("svg:g")
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
   .attr("font-family", "Rosario")
   .attr("color", "black")
   .attr("font-size", 12)
   .attr("font-weight", "bold")
   .style("opacity", 0)
   .transition()
    .duration(800)
   .style("opacity", 1)
   .text(function(d) { return programNames[d.index] });

  var chords = svg.selectAll("path.chord")
                  .data(chord.chords)
                  .enter()
                  .append("svg:path")
                    .attr("class", "chord")
                    .style("stroke", function(d) { return d3.rgb(fill(d.source.index < d.target.index ? d.source : d.target)).darker(); })
                    .style("fill", function(d) { return fill(d.source.index < d.target.index ? d.source : d.target); })
                    .attr("d", d3.svg.chord().radius(innerRadius))
                    .style("opacity", 0)
                    .transition()
                      .duration(2750)
                    .style("opacity", 1);


});
