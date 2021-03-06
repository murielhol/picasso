const chartsvg     = d3.select(".widget").append("svg")
                    .attr("width", 600)
                    .attr("height", 450);
      chartmargin  = {top: 20, right: 20, bottom: 30, left: 130},
      chartwidth   = 550 - chartmargin.left - chartmargin.right,
      chartheight  = 350 - chartmargin.top  - chartmargin.bottom,
      chartx       = d3.scaleBand().rangeRound([0, chartwidth]).padding(0.2),
      charty       = d3.scaleLinear().rangeRound([chartheight, 0]),
      gChart       = chartsvg.append("g")
                   .attr("transform", `translate(${chartmargin.left},${chartmargin.top})`);




function update_chart(clustereddata, currentdate, colors, show){
  d3.select(".widget").selectAll("g > *").transition().duration(100).remove() //TODO: Create transition in creating new chart
  d3.selectAll(".charttooltip").transition().duration(100).remove();
  //var rainbow = d3.scaleSequential(d3.interpolateRainbow).domain([0,d3.sum(data, d => 1)]);

  var charttooltip = d3.select("#statsright").select(".widget").append("div").attr("class", "charttooltip").style("opacity", 0);


var groupstyle = d3.nest()
  .key(function(d) { return d.sub; })
  .entries(clustereddata);

groupstyle.forEach(function(d) {
  var totalpaintings = 0;
  d.style = d.key;
  for(var i = 0; i < d.values.length; i++){
    totalpaintings += d.values[i].id.length;
  }
  d.totalpaintings = totalpaintings;
});

var filteramount = groupstyle.sort(function(a, b) {
  return d3.descending(+a.totalpaintings, + b.totalpaintings);
}).slice(0, 6);

  chartx.domain(filteramount.map(function(d){
    return d.style;
  }));
  charty.domain([0, d3.max(filteramount, function(d){
      return d.totalpaintings})]);


  var bars = gChart.selectAll(".bar")
  .data(filteramount, function(d){
    return + d.style;
  });  
  bars.exit(); 
  bars.enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function(d){return chartx(d.style)})
  //.attr("transform", function(d) {return "rotate(-65)"})
  .attr("y", function(d){
    return charty(d.totalpaintings);
  })
  .attr("fill", function(d) {
    return colors[show][d['values'][0]['sub']]})
  .attr("width", chartx.bandwidth())
  .attr("height",function(d){  
      return chartheight - charty(d.totalpaintings) 
    })
    .on("mouseover", function(chartdata){
      console.log(chartdata)

      charttooltip.transition()		
      .duration(200)		
      .style("opacity", 1)

      charttooltip
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px")
      .html("Style: " + (chartdata.style) + "<br>" + "Total amount: " + (chartdata.totalpaintings));

      var circles = d3.selectAll("circle").nodes(chartdata).filter(function(circledata){
        return chartdata.style === circledata.__data__.sub;
      })

      circles.forEach(function(d){
        d.pulse = true;
      })
    console.log(circles)

    pulsate(circles)
      
      // .node();
      // var circledata = circles.__data__;

    
    
  })
      .on("mouseout", function(d){ 
        charttooltip.transition()		
        .duration(500)		
        .style("opacity", 0);
    })
   


  // function pulsate(selection) {
  //   recursive_transitions();

  //   function recursive_transitions() {

  //     selection.forEach(function(d){
  //       // console.log(d.attributes.r)
  //       if (d.pulse & d.attributes.r.value != 0) {
  //         console.log(d.transform)
  //         d.attributes("class", "pulse")
            
  //         } else {
  //           // d.attr("class", "path")
  //       }
  //     })
    
  //   }
  // }


bars.transition()
    .duration(200)
    .ease(d3.easeLinear)
    .attr("y", function(d){
      return charty(d.totalpaintings);
    })
    .attr("fill", function(d) {return colors[show][d['values'][0]['sub']]}) 
    .attr("height",function(d){  
      return chartheight - charty(d.totalpaintings) 
    })
    
  gChart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + chartheight + ")")
    .call(d3.axisBottom(chartx))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-30)")


  // .attr("transform", "rotate(45)")  
  gChart.append("g")
      .attr("class", "axis axis-y")
      .call(d3.axisLeft(charty).ticks(10).tickSize(8))
  
  
  // gChart.selectAll(".bar")
  //   .data(filteramount)
  //   .enter().append("rect")
  //     .attr("class", "bar")
  //     .attr("x", d => chartx(d.style))
  //     .attr("y", function(d){
  //       return charty(d.totalpaintings);
  //     })
  //     .attr("width", chartx.bandwidth())
  //     .attr("height",function(d){  
  //         return chartheight - charty(d.totalpaintings) 
  //       })
        
  
}