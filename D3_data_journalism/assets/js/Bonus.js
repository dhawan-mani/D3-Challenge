
// Set up SVG width and height
let svgWidth = 960;
let svgHeight = 600;

// set up margins in svg
let margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

// calculate chart height and width
let width = svgWidth - margin.right - margin.left;
let height = svgHeight - margin.top - margin.bottom;


// Selecting the scatter id and appending the chart to it
let chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

//append an svg element to the chart 
let svg = chart.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//initial parameters; x and y axis
let chosenXAxis = 'poverty';
let chosenYAxis = 'healthcare';

//a function for updating the x-scale variable upon click of label
function xScale(data, chosenXAxis) {
    //scales
    let xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}
//a function for updating y-scale variable upon click of label
function yScale(data, chosenYAxis) {
  //scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
//a function for updating the xAxis upon click
function renderXAxis(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

//function used for updating yAxis variable upon click
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

//a function for updating the circles with a transition to new circles 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(2000)
      .attr('cx', data => newXScale(data[chosenXAxis]))
      .attr('cy', data => newYScale(data[chosenYAxis]))

    return circlesGroup;
}

//function for updating STATE labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(2000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    //style based on variable
    //poverty
    if (chosenXAxis === 'poverty') {
        return `${value}%`;
    }
    //household income
    else if (chosenXAxis === 'income') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}

//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    //poverty
    if (chosenXAxis === 'poverty') {
      var xLabel = 'In Poverty(%)';
    }
    //income
    else if (chosenXAxis === 'income'){
      var xLabel = 'Household Income(Median)';
    }
    //age
    else {
      var xLabel = 'Age(Median):';
    }
//Y label
  //healthcare
  if (chosenYAxis ==='healthcare') {
    var yLabel = "Lacks Healthcare(%)"
  }
  else if(chosenYAxis === 'obesity') {
    var yLabel = 'Obesity(%)';
  }
  //smoking
  else{
    var yLabel = 'Smokes(%):';
  }

  //create tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .attr('class', 'toolTip')
    .offset([-5, 0])
    .html(function(d) {
        return (`${d.state},${d.abbr}<br>${chosenXAxis} : ${styleX(d[chosenXAxis], chosenXAxis)}<br>${chosenYAxis}: ${d[chosenYAxis]}%`);
  });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}
//retrieve data
d3.csv('./assets/data/data.csv').then(function(data) {

    console.log(data);
    
    //Parse data
    data.forEach(function(data){
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //create linear scales
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    //create x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    //append Y
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);
    
    //append Circles
    var circlesGroup = chartGroup.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .classed('stateCircle', true)
      .attr('cx', d => xLinearScale(d[chosenXAxis]))
      .attr('cy', d => yLinearScale(d[chosenYAxis]))
      .attr('r', 14)
      .attr('fill','pink')
      .attr('opacity', '.5');

    //append Initial Text
    var textGroup = chartGroup.selectAll('.stateText')
      .data(data)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[chosenXAxis]))
      .attr('y', d => yLinearScale(d[chosenYAxis]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.abbr});

    //create a group for the x axis labels and appending labels one by one
    var xLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var PovertyLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty')
      .text('In Poverty (%)');
      
    var AgeLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age')
      .text('Age (Median)');  

    var IncomeLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'income')
      .text('Household Income (Median)')

//create a group for the x axis labels and appending labels one by one
    var yLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var HealthcareLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'healthcare')
      .text('Without Healthcare (%)');
    
    var SmokesLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'smokes')
      .text('Smokes (%)');
    
    var ObesityLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'obesity')
      .text('Obese (%)');
    
    //update the toolTip
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis event listener
    xLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if (value != chosenXAxis) {

          //replace chosen x with a value
          chosenXAxis = value; 

          //update x for new data
          xLinearScale = xScale(data, chosenXAxis);

          //update x 
          xAxis = renderXAxis(xLinearScale, xAxis);

          //upate circles with a new x value
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          //update text 
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

          //update tooltip
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          //change of classes changes text
          if (chosenXAxis === 'poverty') {
            PovertyLabel
            .classed('active', true)
            .classed('inactive', false);
            AgeLabel
            .classed('active', false)
            .classed('inactive', true);
            IncomeLabel
            .classed('active', false)
            .classed('inactive', true);
          }
          else if (chosenXAxis === 'age') {
            povertyLabel
            .classed('active', false)
            .classed('inactive', true);
            AgeLabel
            .classed('active', true)
            .classed('inactive', false);
            IncomeLabel
            .classed('active', false)
            .classed('inactive', true);
          }
          else {
            PovertyLabel
            .classed('active', false)
            .classed('inactive', true);
            AgeLabel
            .classed('active', false)
            .classed('inactive', true);
            IncomeLabel
            .classed('active', true)
            .classed('inactive', false);
          }
        }
      });
    //y axis lables event listener
    yLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if(value !=chosenYAxis) {
            //replace chosenY with value  
            chosenYAxis = value;

            //update Y scale
            yLinearScale = yScale(data, chosenYAxis);

            //update Y axis 
            yAxis = renderYAxis(yLinearScale, yAxis);

            //Udate CIRCLES with new y
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update TEXT with new Y values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update tooltips
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //Change of the classes changes text
            if (chosenYAxis === 'obesity') {
              ObesityLabel
              .classed('active', true).classed('inactive', false);
              SmokesLabel
              .classed('active', false).classed('inactive', true);
              HealthcareLabel
              .classed('active', false).classed('inactive', true);
            }
            else if (chosenYAxis === 'smokes') {
              ObesityLabel
              .classed('active', false)
              .classed('inactive', true);
              SmokesLabel
              .classed('active', true)
              .classed('inactive', false);
              HealthcareLabel
              .classed('active', false)
              .classed('inactive', true);
            }
            else {
              ObesityLabel
              .classed('active', false)
              .classed('inactive', true);
              SmokesLabel
              .classed('active', false)
              .classed('inactive', true);
              HealthcareLabel
              .classed('active', true)
              .classed('inactive', false);
            }
          }
        });
});

