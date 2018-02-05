var margin = {top: 20, right: 30, bottom: 40, left: 30},
		width = 500 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	
	// scales
	var xScale = d3.scaleBand()
		.rangeRound([0, width])
		.paddingInner(0.1);

	var yScale = d3.scaleLinear()
		.range([height,0]);
		
//*******************
		
	var div = d3.select("#container").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    function make_y_gridlines() {
     return d3.axisLeft(yScale)
       .ticks(10)
   }
	// load data
	d3.csv("fake2.csv", type, function(error, data) {	
		
		console.log(data);
		
		// domains
//		xScale.domain([-.23, .18]); // approximates values in csv
xScale.domain(data.map(function(d) { return d.item; }));
		yScale.domain(d3.extent(data, function(d) { return d.dyr; })).nice();
		
		
		// define X axis
		var formatAsPercentage = d3.format("1.0%");

    
		var yAxis = d3.axisLeft()
							  .scale(yScale)
							  .tickFormat(formatAsPercentage);
     
   	
		// create svg
		var svg = d3.select("#container")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
		var g = svg.append("g")
			
		
		// format tooltip
		var thsndFormat = d3.format(",");
    
    var gridLine = svg.append("g")
			.attr("class","grid")
			.style("stroke-dasharray",("2,5"))
  		.call(make_y_gridlines()
            .tickSize(-width)
	.tickFormat("")
						) 
						
	gridLine.selectAll("line")
			.attr("x2", width + margin.left );

		// create  bars
		svg.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
				.attr("class", function(d) { return "bar bar--" + (d.dyr < 0 ? "negative" : "positive"); })
				.attr("y", function(d) { return yScale(Math.max(0, d.dyr)); })
				.attr("x", function(d) { return xScale(d.item) + margin.left; })
				.attr("height", function(d) { return Math.abs(yScale(0) - yScale(d.dyr)); })
				.attr("width", xScale.bandwidth())
			// tooltip
			// .on("mouseover", function(d) {
			// 	div.transition()
			// 	 .duration(200)
      //    .style("opacity", 1.0);
			// 	div.html("2014 estimate:   " + thsndFormat(d.est2014) + "<br/>" + "2024 projected:   " 
			// 			+ thsndFormat(d.proj2024) + "<br/>" + "Net change:   " + thsndFormat(d.netChange))
      //   .style("left", (d3.event.pageX) + "px")
      //   .style("top", (d3.event.pageY - 28) + "px");
			// })
			// .on("mouseout", function(d) {
      //   div.transition()
			// 		.duration(500)
			// 		.style("opacity", 0);
      // });
    
		svg.append("g")
      .attr("class", "y axis")
      
      .attr("transform", "translate(" + margin.left + "," + margin.top/1.1 + ")") 
       
      .call(customYAxis);

      function customYAxis(g) {
      g.call(yAxis);
      g.select(".domain").remove();
      g.selectAll(".tick line").remove();
      g.selectAll(".tick text").attr("x", -10).attr("dy", -4);
    }
   
    //   function customYAxis("g") {
    //   svg.call(yAxis);
    //   svg.select(".domain").remove();
    //   svg.selectAll(".tick:not(:first-of-type) line")svg.attr("stroke", "#D3D3D3").attr("stroke-dasharray", "2,2");
    //   svg.selectAll(".tick text").attr("x", 4).attr("dy", -4);
    // }
			
		// add tickNegative
		var tickNeg = svg.append("g")
				.attr("class", "x axis")
		
				.attr("transform", "translate(" + margin.left + "," + yScale(0) + ")")
				.call(d3.axisBottom(xScale))
			.selectAll(".tick")
			.filter(function(d, i) { return data[i].dyr < 0; });

		tickNeg.select("line")
			.attr("y2", -6);
			
		tickNeg.select("text")
			.attr("y", -18)
      .style("text-anchor", "middle")
      .attr('font-family','Cabin')
      .attr('font-size','12px')	
		
		});
		
function type(d) {
  d.dyr = +d.dyr;
  return d;
}