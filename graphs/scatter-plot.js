(() => {
  const socket = io.connect();

  let margin = { top: 25, right: 20, bottom: 20, left: 80 };
  let width, height;

  let dataCache = {};
  let settings;

  socket.on('sendScatterData', (data) => {
    // console.log('data: ', data);
    if (data.length > 0) {
      if (!settings) settings = drawGrid(data);

      let needsChange = false;

      for (let i = 0; i < data.length; i += 1) {
        if (data[i].yScale !== dataCache[data[i].id]) {
          needsChange = true;
          dataCache[data[i].id] = data[i].yScale;
        }
      }
      if (needsChange) drawContent(settings, data);
    }
  });

  function drawGrid(data) {
    d3.select('#scatterSVG').remove();

    width = data[0].setWidth - margin.left - margin.right;
    height = data[0].setHeight - margin.top - margin.bottom;

    let svg = d3.select('#scatter-plot')
      .append('svg')
      .attr('id', 'scatterSVG')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    let yScale = d3.scaleLinear()
      .domain([data[0].yDomainLower, data[0].yDomainUpper])
      .range([height, 0])
      .nice()

    let yAxis = d3.axisLeft(yScale)

    svg
      .append('g')
      .attr('id', 'yAxis')
      .call(yAxis);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 5)
      .attr("x", 0)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text(data[0].yLabel_text)
      .style('font-size', `${data[0].label_font_size}px`);

    let xScale = d3.scaleLinear()
      .domain([data[0].xDomainLower, data[0].xDomainUpper])
      .range([0, width])
      .nice();

    let xAxis = d3.axisBottom(xScale)
      .ticks(10);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'xAxis')
      .call(xAxis);

    svg.append('text')
      .attr("y", height + margin.bottom + 7)
      .attr("x", width)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text(data[0].xLabel_text)
      .style('font-size', `${data[0].label_font_size}px`);

    let settings = {
      svg,
      yScale,
      yAxis,
      xScale,
      xAxis,
    }

    return settings;
  }

  function drawContent(settings, data) {

    let svg = settings.svg;
    let yScale = settings.yScale;
    let yAxis = settings.yAxis;
    let xScale = settings.xScale;
    let xAxis = settings.xAxis;

    width = data[0].setWidth - margin.left - margin.right;
    height = data[0].setHeight - margin.top - margin.bottom;

    let rScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.volume)])
      .range([10, 50]);

    //create circles but group them in svg container so work better with text when animating 
    let circles = svg
      .selectAll('.ball')
      .data(data, d => d.id);

    circles.exit().remove();

    //ENTER.
    let newCircles = circles
      .enter()
      .append('g')
      .attr('class', 'ball')
      .attr('transform', d => `translate(${xScale(d.xScale)}, ${yScale(d.yScale)})`)

    newCircles.append('circle')
      .transition()
      .duration(data[0].transition_speed)
      .style("opacity", 1)
      .attr('class', 'circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', d => rScale(d.volume))
      .style('fill', '#' + (Math.random() * 0xFFFFFF << 0).toString(16))
      .style('fill-opacity', 0.5)

    newCircles
      .append('text')
      .style('text-anchor', 'middle')
      .style('fill', 'black')
      .attr('y', 4)
      .text(d => d.circle_text);

    //UPDATE
    circles
      .attr('transform', d => `translate(${xScale(d.xScale)}, ${yScale(d.yScale)})`)

    let updateCircles = circles.select('.circle')

    if (Object.keys(dataCache).length === data.length) {
      updateCircles._groups[0] = circles.select('.circle')._groups[0].filter(d => d.__data__.volume !== dataCache[d.__data__.id]);
    }

    updateCircles
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', d => rScale(d.volume))

    updateCircles
      .append('text')
      .style('text-anchor', 'middle')
      .attr('y', 4)
      .text(d => d.circle_text);
  }
})()




