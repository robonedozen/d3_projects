d3.csv("data/cardioActivities_simple2.csv", function(error, data) {

var iWidth = window.innerWidth;
var buffer = 100;

var   margin = { top: 0, right: 0, bottom: 30, left: 40 },
    // width = 1200 - margin.left - margin.right,
    // height = 400 - margin.top - margin.bottom;
    height = 410,
    width = iWidth - buffer - 120;

// Parse the date / time
var	parseDate = d3.isoParse

var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat("%b"))
    .ticks(d3.timeDay.every(365));

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.distance = +d.distance;
    });



  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.distance; })]);




  var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "left")
      .attr("dx", "-2em")
      .attr("dy", ".05em")
      .attr("transform", "rotate(-90)" );
      // .attr()

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.ticks(null).tickSize(0))
    .append("text")
//       .attr("transform", "rotate(-90)")
      .attr("y", 6)
//       .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Value");

  myChart = svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", function(d){ return d.distance > 4 ? '#EF5F67': '#3FC974'})
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.bandwidth())
      // .attr("transform", "rotate(90)")
      .attr("y", function(d) { return y(d.distance); })
      .attr("height", function(d) { return height - y(d.distance); })

      .on('mouseover', function(d) {
        tooltip.transition().duration(200)
          .style('opacity', .9)
        tooltip.html(
          '<div style="font-size: 1rem; font-weight: bold">' +
            d.distance + ' mi. <br> ' + d.date + '</div>'
        )
          .style('left', (d3.event.pageX -35) + 'px')
          .style('top', (d3.event.pageY -30) + 'px')
        distColor = this.style.fill;
        d3.select(this)
          .style('fill', 'blue')
      })

      .on('mouseout', function(d) {
        tooltip.html('')
        d3.select(this)
          .style('fill', distColor)
      });



});
