/**
 * @ref http://jsfiddle.net/KjrGF/12/
 * cool filter options to check out in the future
 */

// const { layout } = require("d3");

var margin = { top:30, right:25, bottom:30, left:25 },
    width = 800 - (margin.left + margin.right),
    height = 650 - (margin.top + margin.bottom),
    padding = 0.02,
    outerRadius = Math.min(width, height) / 2 - 100,
    innerRadius = outerRadius - 15;

var dataset = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZh1p5c6wLl1A3ir81WmupVlzOUr3MPGjMbV9F42HRu_XrKXUOu2wOu_WQPOIr4Am5aiu_heGT3AM1/pub?gid=0&single=true&output=csv";

var formatPercent = d3.format("%");
var numberWCommas = d3.format("0,f");

var arc = d3.svg.arc()
                  .innerRadius(innerRadius)
                  .outerRadius(outerRadius);

var path = d3.svg.chord()
                  .radius(innerRadius);
            
function getDefaultLayout() {
  return d3.layout.chord()
                  .padding(padding)
                  .sortSubgroups(d3.descending)
                  .sortChords(d3.ascending);
}

var last_layout;
var neighborhoods;

var g = d3.select("#dw_placeholder")
          .append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("id", "circle")
            .attr("transform",
                  "translate(" + (width / 2) + "," + (height / 2) + ")");

g.append("circle")
    .attr("r", outerRadius);

d3.csv(dataset, function(error, neighborhoodData) {

  if (error) { 
    alert("Error reading file: ", error.statusText);
    return;
  }

  neighborhoods = neighborhoodData;
  updateChords(dataset);

});

function updateChords(datasetURL) {

  var matrix = JSON.parse(d3.select(datasetURL).text());
  console.log(matrix);

  layout = getDefaultLayout();
  layout.matrix(matrix);

  var groupG = g.selectAll("g.group")
                .data(layout.groups(), function(d) { return d.index; });
  
  groupG.exit()
        .transition()
          .duration(1500)
          .attr("opacity", 0)
        .remove();
  
  var newGroups = groupG.enter()
                        .append("g")
                          .attr("class", "group");
  
  newGroups.append("title");

  groupG.select("title")
        .text(function(d, i) { return neighborhoods[i].name; });

  newGroups.append("path")
            .attr("id", function(d) { return "group" + d.index; })
            .style("fill", function(d) { return neighborhoods[d.index].color; });

  groupG.select("path")
        .transition()
          .duration(1500)
          .attr("opacity", 0.5)
        .attrTween("d", arcTween(last_layout))
          .transition()
            .duration(100)
            .attr("opacity", 1);
  
  newGroups.append("svg:text")
            .attr("xlink:href", function(d) { return "#group" + d.index; })
            .attr("dy", "0.35em")
            .attr("color", "#fff")
            .text(function(d) { return neighborhoods[d.index].name; });
  
  groupG.select("text")
        .transition()
          .duration(1500)
          .attr("transform", function(d) {
            d.angle = (d.startAngle + d.endAngle) / 2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                   "translate(" (innerRadius + 25) + ")" +
                   (d.angle > Math.PI ? " rotate(180)" : " rotate(0)");
          })
          .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : "begin"; });
  
  var chordPaths = g.selectAll("path.chord")
                    .data(layout.chords(), chordKey);

  var newChords = chordPaths.enter()
                            .append("path")
                              .attr("class", "chord");

  newChords.append("title");

  chordPaths.select("title")
            .text(function(d) { return neighborhoods[d.source.index].name });
  
  chordPaths.exit()
            .transition()
              .duration(1500)
              .attr("opacity", 0)
              .remove();

  chordPaths.transition()
              .duration(1500)
              .attr("opacity", 0.5)
              .style("fill", function(d) { return neighborhoods[d.source.index].color; })
            .attrTween("d", chordTween(last_layout))
              .transition()
                .duration(100)
                .attr("opacity", 1);

  groupG.on("mouseover", function(d) {
    chordPaths.classed("fade", function(p) { return (p.source.index != d.index) && (p.target.index != d.index) });
  });

  last_layout = layout;

}

function arcTween(oldLayout) {

  var oldGroups = {};

  if (oldLayout) {
    oldLayout.groups().forEach(function(groupData) {
      oldGroups[groupData.index] = groupData;
    });
  }

  return function(d, i) {

    var tween;
    var old = oldGroups[d.index];

    if (old) {
      tween = d3.interpolate(old, d);
    }
    else {
      var emptyArc = { startAngle:d.startAngle, endAngle:d.endAngle };
      tween = d3.interpolate(emptyArc, d);
    }

    return function(t) { return arc(tween(t)); };

  };

}

function chordKey(data) {
  return (data.source.index < data.target.index) ?
            (data.source.index + "-" + data.target.index) :
            (data.target.index + "-" + data.source.index);
}

function chordTween(oldLayout) {

  var oldChords = {};

  if (oldLayout) {
    oldLayout.chords().forEach(function(chordData) {
      oldChords[chordKey(chordData)] = chordData;
    });
  }

  return function(d, i) {

    var tween;
    var old = oldChords[chordKey(d)];

    if (old) {
      if (d.source.index != old.source.index) {
        old = { source:old.target, target:old.source };
        tween = d3.interpolate(old, d);
      }
    }
    else {
      var emptyChord = {
        source: { startAngle:d.source.startAngle, endAngle:d.source.startAngle },
        target: { startAngle:d.target.startAngle, endAngle:d.target.startAngle }
      };
      tween = d3.interpolate(emptyChord, d);
    }

    return function(t) { return path(tween(t)); };

  };

}

















