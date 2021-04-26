d3.chart = d3.chart || {};

/** 
 * Additional reference:
 * @author François Zaninotto
 * @see https://github.com/fzaninotto/DependencyWheel
 */

d3.chart.dependencyWheel = function(options) {
  var width = "800";
  var height = "650";
  var margin = 250;
  var padding = 0.02;

  function chart(selection) {
    selection.each(function(data) {
      // console.log(data);
      var matrix = data.matrix;
      var programNames = data.programNames;
      var radius = height / 2 - margin - 100;

      // create the layout
      var chord = d3.chord()
        .padAngle(padding)
        .sortSubgroups(d3.descending);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg:svg")
        .attr("width", width)
        .attr("height", width)
        .attr("class", "dependencyWheel")
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

      var arc = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius + 10);

      var fill = function(d) {
        // const color = "hsl(" + parseInt(((programNames[d.index][programNames[d.index].length-1].charCodeAt() - 97) / 26) * 360, 10) + ",85%,75%)";
        const color = "hsl(" + parseInt(d.index / programNames.length * 360, 10) + ",95%,65%)";
        // console.log(parseInt(((programNames[d.index][2].charCodeAt() - 97) / 26) * 360, 10))
        // console.log('-');
        return color;
      };

      // Returns an event handler for fading a given chord group.
      var fade = function(opacity) {
        return function(g, i) {
          gEnter.selectAll(".chord")
              .filter(function(d) {
                return d.source.index != i && d.target.index != i;
              })
            .transition()
              .style("opacity", opacity);
          var groups = [];
          gEnter.selectAll(".chord")
              .filter(function(d) {
                if (d.source.index == i) {
                  groups.push(d.target.index);
                }
                if (d.target.index == i) {
                  groups.push(d.source.index);
                }
              });
          groups.push(i);
          
          gEnter.selectAll('.group')
              .filter(function(d) {
                for (var i = 0; i < groups.length; i++) {
                  if(groups[i] == d.index) return false;
                }
                return true;
                // return groups.some(function (group) {
                //   return group != d.index;
                // });
              })
              .transition()
                .style("opacity", opacity);
        };
      };

      function wrap(text, width, lineH) {
        text.each(function () {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = lineH, // ems
              x = text.attr("x"),
              y = text.attr("y"),
              dy = 0, //parseFloat(text.attr("dy")),
              tspan = text.text(null)
                          .append("tspan")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("dy", dy + "em");
          console.log(d3.select(this));
          while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                  line.pop();
                  tspan.text(line.join(" "));
                  line = [word];
                  tspan = text.append("tspan")
                              .attr("x", x)
                              .attr("y", y)
                              .attr("dy", lineNumber * lineHeight + dy + "em")
                              .text(word);
              }
          }
        });
      }

      var chordResult = chord(matrix);

      var rootGroup = chordResult.groups[0];
      var rotation = - (rootGroup.endAngle - rootGroup.startAngle) / 2 * (180 / Math.PI);

      var g = gEnter.selectAll("g.group")
        .data(chordResult.groups)
        .enter().append("svg:g")
        .attr("class", "group")
        .attr("transform", function(d) {
          return "rotate(" + rotation + ")";
        });

      g.append("svg:path")
        .style("fill", fill)
        .style("stroke", fill)
        .attr("d", arc)
        .style("cursor", "pointer")
        .on("mouseover", fade(0.1))
        .on("mouseout", fade(1));

      g.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("width", 120)
        .attr("height", 50)
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
          return "rotate(" + ((d.angle * 180 / Math.PI) - 90) + ")" +
          
          // "translate(" + (radius + 15) + "," + (-25) + ")";// +
                 "translate(" + (radius + 20) + ")" +
            (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .attr("fill", 'black') // CHANGE FONT COLOR HERE ********************************************************************
        .attr("font-size", 12)
        .classed('package-label', true)
        .attr("id", function(d) { return programNames[d.index] })
        .style("cursor", "pointer")
        .text(function(d) { return programNames[d.index]; })
        // .call(wrap, 15)
        .on("mouseover", fade(0.1))
        .on("mouseout", fade(1));

      // g.append("svg:text")
      //  .attr("x", function(d) { return parent.x })
      //  .text(function(d) { if (d.index === 0)  return programNames[d.index]; })
      //  .call(wrap, 10, 0.25)

      gEnter.selectAll("path.chord")
          .data(chordResult)
          .enter().append("svg:path")
          .attr("class", "chord")
          .style("stroke", function(d) { return d3.rgb(fill(d.source)).darker(); })
          .style("fill", function(d) { return fill(d.source); })
          .attr("d", d3.ribbon().radius(radius))
          .attr("transform", function(d) {
            return "rotate(" + rotation + ")";
          })
          .style("opacity", 1);
    });
  }

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.margin = function(value) {
    if (!arguments.length) return margin;
    margin = value;
    return chart;
  };

  chart.padding = function(value) {
    if (!arguments.length) return padding;
    padding = value;
    return chart;
  };

  return chart;
};