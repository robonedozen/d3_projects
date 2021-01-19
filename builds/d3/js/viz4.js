//NEED TO ATTACH MILES WITH Dates

// var parseDate = d3.timeParse("%m/%d/%Y");
var	parseDate = d3.isoParse;

d3.csv('js/data/cardioActivities_simple2.csv')
  .row(function(d){ return {date: parseDate(d.date), distance: Number(d.distance.trim())};})
  .get(function(error,d){

  // Convert distance to numbers
  // d.forEach(function( data ) {
    // data.distance = +data.distance;
  // })

  var iWidth = window.innerWidth;
  // console.log(iWidth);
  var buffer = 100;

  var distance = [],
      dates = [],
      margin = { top: 0, right: 0, bottom: 30, left: 40 }
      height = 410,
      width = iWidth - buffer - 120;
      // height = 400 - margin.top - margin.bottom,
      // width = 600 - margin.left - margin.right;
            // time_parse = d3.timeParse('%m/%d/%Y'),
      // time_format = d3.timeFormat('%b %d');

  var   distColor,
        yScale,
        yAxisValues,
        yAxisTicks,
        yGuide,
        xScale,
        xAxisValues,
        xAxisTicks,
        xGuide,
        colors,
        tooltip,
        myChart;

  for (var i = 0; i<d.length; i++) {
    distance.push(d[i].distance);
    dates.push( new Date(d[i].date) );
  }


  yScale = d3.scaleLinear()
    .domain([0, d3.max(distance)])
    .range([0,height]);

  yAxisValues = d3.scaleLinear()
    .domain([0, d3.max(distance)])
    .range([height,0]);

  yAxisTicks = d3.axisLeft(yAxisValues)
                .ticks(10)

  xScale = d3.scaleBand()
    .domain(distance)
    .paddingInner(.1)
    .paddingOuter(0)
    .range([0, width])

    // var minDate = d3.min(dates,function(d) { return d.date; });
    // var maxDate = d3.max(dates,function(d) { return d.date; });

  xAxisValues = d3.scaleTime()
    .domain([dates[0],dates[(dates.length-1)]])
    .range([0, width])
    // .domain([minDate,maxDate])


  xAxisTicks = d3.axisBottom(xAxisValues)
                  .scale(xAxisValues)
                  .tickFormat(d3.timeFormat('%b %d'));
    // .ticks(d3.timeDay.every(60))

  colors = d3.scaleLinear()
    .domain([0, 2, d3.max(distance)])
    .range(['#FFFFFF', '#2D8BCF' ,'#f44336'])

  tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0);

  myChart = d3.select('#viz').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.right + ')')
    .selectAll('rect').data(distance)
    .enter().append('rect')
      .attr('fill', colors)
      .attr('width', function(d) {
        return xScale.bandwidth();
      })
      // .attr('width',width)
      .attr('height', 0)
      .attr('x', function(d) {
        return xScale(d);
      })
      .attr('y', height)

      .on('mouseover', function(d) {
        tooltip.transition().duration(200)
          .style('opacity', .9)
        tooltip.html(
          '<div style="font-size: 1rem; font-weight: bold">' +
            d + ' mi.</div>'
        )
          .style('left', (d3.event.pageX -35) + 'px')
          .style('top', (d3.event.pageY -30) + 'px')
        distColor = this.style.fill;
        d3.select(this)
          .style('fill', 'green')
      })

      .on('mouseout', function(d) {
        tooltip.html('')
        d3.select(this)
          .style('fill', distColor)
      });

  yGuide = d3.select('#viz svg').append('g')
            .attr('transform', 'translate(25,0)')
            .call(yAxisTicks)

  xGuide = d3.select('#viz svg').append('g')
            .attr('transform', 'translate(25,'+ height + ')')
            // .attr("transform", "rotate(-90)" )
            .call(xAxisTicks)

  myChart.transition()
    .attr('height', function(d) {
      return yScale(d);
    })
    .attr('y', function(d) {
      return height - yScale(d);
    })
    .delay(function(d, i) {
      return i * 20;
    })
    .duration(1000)
    .ease(d3.easeBounceOut)

}); // json import
