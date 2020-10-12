
function make_responsive(){
    let Healthcare=[];
    let Poverty=[] ;  
    let Age =[];
    let Smoke =[];
    let obesity = [];
    var svgArea = d3.select("#scatter").select("svg");
    if(!svgArea.empty()){
        svgArea.remove();
    };

// Clear svg area if its not empty

 // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.

  svgheight = window.innerHeight;
  svgwidth = window.innerWidth;
  var svg = d3.select("#scatter").append("svg")
  .attr("height",svgheight)
  .attr("width",svgwidth);
  

  var margin = {
      top:50,
      bottom:100,
      left:50,
      right:300
  }
//   Setting chart Height and width attributes

   let Chartheight = svgheight-margin.top-margin.bottom;
    let ChartWidth = svgwidth-margin.left-margin.right;

// Creating a chartgroup variable and translating the values by margins on top and left
let chartgroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);


// Fetching the data from csv file
d3.csv("assets/data/data.csv").then(function(data){
    console.log(data);
    Healthcare.push(data.map((data)=>+data.healthcare))
    Poverty.push(data.map((data)=>+data.poverty))
    
    // create scales
    var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(Poverty[0]))
    .range([0, ChartWidth]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(Healthcare[0])])
    .range([Chartheight+80, 0])

    //  Setting axis
    var xaxis = d3.axisBottom(xLinearScale);
    var yaxis = d3.axisLeft(yLinearScale).ticks(10);

    // Append axis
    chartgroup.append("g").attr("transform",`translate(0,${Chartheight})`)
    .call(xaxis)

    chartgroup.append("g")
    .call(yaxis);

      // append circles
      var circlesGroup = chartgroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .classed('stateCircle', true)
      .attr("cx",d=> xLinearScale(d.poverty+50))
      .attr("cy", d=> yLinearScale(d.healthcare))
      .attr("r", "10")
      .style("fill", d3.color("steelblue"))
      .attr("stroke-width", "1");

// Appending text to the circles
      var text = chartgroup.selectAll(null)
        .data(data)
        .enter()
        .insert("text");

      var textLabels = text
        .attr("x", function(d) {
          return xLinearScale(d.poverty);
        })
        .attr("text-anchor", "middle")
        .attr("y", function(d) {
          return yLinearScale(d.healthcare);
        })
        .text(function(d) {
          return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "5px")
        .attr("fill", "white");

    // Create axes labels
    chartgroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0 - (Chartheight / 1.2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
      .text("Lack of Healthcare(%)");

    chartgroup.append("text")
      .attr("transform", `translate(${ChartWidth / 3}, ${Chartheight + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
      .text("In Poverty(%)");
  }).catch(function(error) {
    console.log(error);
  

});
}
make_responsive();
