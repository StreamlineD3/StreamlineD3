(function () {
  const socket = io.connect();

  //set initial SVG params
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = 400 - margin.left - margin.right;
  let height = 400 - margin.top - margin.bottom;
  let radius = width / 2;

  let dataCache = {};
  //let svg;
  let settings;

  socket.on('sendPieData', (data) => {

    if (data.length > 0) {
      if (!settings) settings = drawGrid(data);

      let needsChange = false;

      for (let i = 0; i < data.length; i += 1) {
        if (data[i].count !== dataCache[data[i].category]) {
          needsChange = true;
          dataCache[data[i].category] = data[i].count;
        }
      }
      if (needsChange) drawContent(settings, data);
    }
  })

  function drawGrid(data) {
    width = data[0].setWidth - margin.left - margin.right;
    height = data[0].setHeight - margin.top - margin.bottom;

    let color = d3.scaleSequential(d3.interpolateSpectral)
      .domain([0, 25]);

    // arc generator for pie
    let arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(20);

    // arc generator for labels
    let labelArc = d3.arc()
      .outerRadius(radius + 30)
      .innerRadius(radius + 10)

    d3.select('#pieSVG').remove();

  //define svg for pie
    let svg = d3.select('#pie-chart')

      .append('svg')
      .attr('id', 'pieSVG')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');

    let settings = {
      color,
      arc,
      labelArc,
      svg
    }

    return settings;
  }

  function drawContent(settings, data) {
    let color = d3.scaleSequential(d3.interpolateSpectral)
      .domain([0, 25]);
    let arc = settings.arc;
    let labelArc = settings.labelArc;
    let svg = settings.svg;

    let pie = d3.pie()
      .sort(null)
      .value(d => d.count);

    let circles = svg.selectAll('.arc')
      .data(pie(data))

    let newCircles = circles
      .enter()
      .append('g')
      .attr('class', 'arc');

    //append the path of the arc
    newCircles.append('path')
      .attr('d', arc)
      .attr('class', 'path')
      .style('fill', (d, i) => color(d.index))
      .style('stroke', '#fff')

    newCircles.append('text')
      .attr('class', 'text')
      .attr("transform", d => {
        let midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
        return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180 / Math.PI) + ")";
      })
      .attr("dy", ".35em")
      .style('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text(d => d.data.category);

    circles.select('.path').transition()
      .duration(1000)
      .style("opacity", 1)
      .attr('d', arc)
      .style('stroke', '#fff')

    circles.select('.text')
      .attr("transform", d => {
        let midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
        return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180 / Math.PI) + ")";
      })
      .attr("dy", ".35em")
      .text(d => d.data.category);
  }

})();





