(function () {
  let socket = io.connect();

  //set initial SVG params
  let margin = { top: 25, right: 20, bottom: 50, left: 50 };
  let width, height;
  let currData = [];
  let settings;

  socket.on('sendLineData', (allData) => {
    if(allData.length === 0) currData = [];
    //if data is not empty or data is new...
    if (allData.length > 0 || (currData.length > 0 && allData[allData.length - 1].xScale !== currData[currData.length - 1].xScale)) {

      if (!settings) settings = drawGrid(allData);

      currData = allData;
      drawContent(settings, allData);
    };
  })

  function drawGrid(allData) {
    width = allData[0].setWidth - margin.left - margin.right;
    height = allData[0].setHeight - margin.top - margin.bottom;

    let yScale = d3.scaleLinear()
      .domain([allData[0].yDomainLower, allData[0].yDomainUpper])
      .range([height, 0]);

    d3.select('#lineSVG').remove();

    svg = d3.select('#line-chart')
      .append('svg')
      .attr('id', 'lineSVG')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('class', 'mount')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg
      .append('g')
      .attr('class', 'yAxis')
      .call(d3.axisLeft(yScale).ticks(allData[0].yTicks));

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", 0)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .style('font-family', 'sans-serif')
    .style('font-size', '13px')
    .text(allData[0].yLabel_text);

    let settings = {
      svg,
      yScale
    }

    return settings;
  }

  function drawContent(settings, allData) {
    let svg = settings.svg;
    let yScale = settings.yScale;

    let line = d3.line()
      .x(d => xScale(d.xScale))
      .y(d => yScale(d.yScale))

    let xScale;

    if (allData[0].shiftXAxis) {
      xScale = d3.scaleLinear()
        .domain([
          d3.min(allData, d => d.xScale),
          Math.max(allData[0].xDomainUpper, d3.max(allData, d => d.xScale))
        ])
        .range([0, width]);

    } else {
      xScale = d3.scaleLinear()
        .domain([allData[0].xDomainLower, allData[0].xDomainUpper])
        .range([0, width]);
    }

    svg.select('#xAxis-line').remove();

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('id', 'xAxis-line')
      .call(d3.axisBottom(xScale).ticks(allData[0].xTicks));
    
    svg.select('#xAxis-label').remove();

    svg.append("text")
      .attr('transform', 'translate(' + (width) + ' ,' + (height + margin.bottom - 5) + ')')
      .attr('id', 'xAxis-label')
      .style('text-anchor', 'end')
      .style('font-family', 'sans-serif')
      .style('font-size', '13px')
      .text(allData[0].xLabel_text);

    let renderedLine = svg
      .selectAll('.line')
      .data(allData)

    let newLine = renderedLine
      .enter()
      .append('path')
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .attr('class', 'line')
      .attr('d', d => line(allData))
      .attr("transform", null)
      .style('stroke', d => d.lineColor)
      .style('stroke-width', 1)
      .style('fill', 'none')
      .style('stroke-linejoin', 'round');


   if (allData.length < allData[0].xDomainUpper) {
      renderedLine.transition()
      .duration(1000)
      .attr('d', d => line(allData))
   } else {
      renderedLine
        .attr('d', d => line(allData))
        .attr("transform", null)
        .transition()
        .duration(1000)
          .attr("transform", "translate(" + -1 + ")");
   }

    let dots = svg.selectAll('.dot')
      .data(allData);

    let newDots = dots
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', line.x())
      .attr('cy', line.y())
      .attr('r', 3)
      .style('fill', 'white')
      .style('stroke-width', 1.5)
      .style('stroke', d => d.dotColor);
     
    dots
      .attr('cx', line.x())
      .attr('cy', line.y())
      .style('fill', 'white')
      .attr("transform", null)
      .transition()
      .duration(1000)
        .attr("transform", "translate(" + -1 + ")");
  }
})();
