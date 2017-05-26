(function () {
  const socket = io.connect();

  //set initial SVG params
  let margin, width, height;
  let dataCache = {};
  let settings;

  //listen for new data
  //drawGrid function only needs to be invoked once to set up static components
  //drawChart function needs to be invoked each time new data is present
  socket.on('sendBarData', (data) => {


    if (data.length > 0) {
      if (!settings) {
        settings = drawGrid(data);
      }
      let needsRender = false;
      for (let i = 0; i < data.length; i += 1) {
        if (dataCache[data[i].id] !== data[i].volume) {
          dataCache[data[i].id] = data[i].volume;
          needsRender = true;
        }

      }
      if (needsRender) drawChart(settings, data);
    }
  });

  function drawGrid(data) {
    margin = { top: 20, right: 40, bottom: 25, left: 50 };
    width = data[0].setWidth - margin.left - margin.right;
    height = data[0].setHeight - margin.top - margin.bottom;

    let svg = d3.select('#bar-graph')
      .append('svg')
      .attr('id', 'barSVG')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    let yScale = d3.scaleLinear()
      .domain([data[0].yDomainLower, data[0].yDomainUpper])
      .range([height, 0]);

    let yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('id', 'yAxis')
      .call(d3.axisLeft(yScale));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text(data[0].yLabel_text)
      .style('font-size', `${data[0].label_text_size}px`);

    let settings = {
      data,
      svg,
      yScale,
      yAxis,
    }
    return settings;
  }

  function drawChart(settings, data) {

    let xScale = d3.scaleBand()
      .paddingOuter(.5)
      .paddingInner(0.1)
      .domain(data.map(d => d.xScale))
      .range([0, width]);

    let xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickSize(10)
      .tickPadding(5);

    d3.select('#xAxis-bar').remove();

    settings.svg
      .append('g')
      .attr('id', 'xAxis-bar')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')

    //ENTER.
    let column = settings.svg.selectAll('g.column-container')
      .data(data);

    let newColumn = column
      .enter()
      .append('g')
      .attr('class', 'column-container')


    newColumn.append('rect').transition()
      .duration(data[0].transition_speed)
      .style("opacity", 1)
      .attr('class', 'column')
      .attr('x', d => xScale(d.xScale))
      .attr('y', d => settings.yScale(d.volume))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - settings.yScale(d.volume))
      .attr('id', d => d.id)
      .style('fill', (d, i) => d.color[i]);

    //UPDATE.
    let updateNodes = column.select('.column');

    //Filter out data that has not changed
    // if (Object.keys(dataCache).length === data.length) {
      // updateNodes._groups[0] = column.select('.column')._groups[0].filter(d => d.__data__.volume !== dataCache[d.__data__.id]);
    // }

    updateNodes.transition()
      .duration(data[0].transition_speed)
      .attr("opacity", 1)
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - settings.yScale(d.volume))
      .attr('x', d => xScale(d.xScale))
      .attr('y', d => settings.yScale(d.volume))
  }

})();
