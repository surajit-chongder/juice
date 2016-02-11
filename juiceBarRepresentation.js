var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("./juice_orders", function(error, data) {
  var totalItem = _.map(data,"drinkName");
  var uniqueCount = _.countBy(totalItem, _.identity);
  var juiceCount = _.omit(uniqueCount, ["CTL","ctl","Register User"]);

  var resultingJuiceData = [];

  _.forIn(juiceCount, function(value, key) {
    var indivisual = {};
    indivisual.item = key;
    indivisual.noOfOrder = value;
    resultingJuiceData.push(indivisual);
  });

  x.domain(resultingJuiceData.map(function(d) { return d.item; }));
  y.domain([0, d3.max(resultingJuiceData, function(d) { return d.noOfOrder; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("noOfOrder");

  svg.selectAll(".bar")
      .data(resultingJuiceData)
    .enter().append("rect")
      .attr("class", "juiceBar")
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return height - y(d.noOfOrder);})
      .attr("x", function(d) { return x(d.item); })
      .attr("y", function(d) { return y(d.noOfOrder); })
        .on('mouseover',function() {
          d3.select(this).append("svg:title")
          .text(function(d) {return d.item +": "+d.noOfOrder;})
        })
});
