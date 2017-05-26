(function () {

  
  const socket = io.connect();

  //set initial SVG params
  let margin = { top: 25, right: 20, bottom: 25, left: 20 };
  let width = 700 - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;

  let dataCache = {};
  let settings;

  socket.on('sendMapData', (data) => {

    if (data.length > 0) {
      if (!settings) settings = drawMap(data);
  
      let needsChange = false;

      for (let i = 0; i < data.length; i += 1) {
        if ([data[i].latitude, data[i].longitude]  !== dataCache[data[i].mapItem]) {
            needsChange = true;
            dataCache[data[i].mapItem] = [data[i].latitude, data[i].longitude];
        }
      }
      if (needsChange) drawContent(settings, data);
    }
  });

  function drawMap(data) {
    width = data[0].setWidth - margin.left - margin.right;
    height = data[0].setHeight - margin.top - margin.bottom;

    //Define map projection
    let projection = d3.geoMercator()
      .translate([width / 2, height / 1.5])
      .scale((width - 1) / 2 / Math.PI);

    //Define path generator
    let path = d3.geoPath()
      .projection(projection);

    //the main svg element
    let svg = d3.select('#map')
      .append('svg')
      .attr("width", width)
      .attr("height", height);

    //group to hold the maps and borders
    let g = svg.append('g')
      .attr('id', 'world-map');

    //Load in GeoJSON data
    d3.json('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25240/world-110m.json', function (error, world) {
      if (error) throw error;
      
      //append the World Map
      let worldMap = g.append('path')
        .datum(topojson.merge(world, world.objects.countries.geometries)) 
        .attr('class', 'land')
        .attr('d', path)
        .style('fill', data[0].color);

      //append the World Map Country Borders
      g.append('path')
        .datum(topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; }))
        .attr('class', 'boundry')
        .attr('d', path)
        .style('fill', 'none')
        .style('stroke', 'white');
    });

    let settings = {
      projection,
      path,
      svg,
    }
    return settings;
  }

  function drawContent(settings, data) {
    // d3.select('#all-points').remove();
    let color = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([0, 200]);

    let points = settings.svg.selectAll('.point-circle')
      .data(data)
    
    points.exit().remove();

    //differentiate new points
    let newPoints = points
      .enter()
      .append('g')
      .attr('class', 'point-circle');

    // Create the circle 
    newPoints
      .append('circle')
      .attr('cx', d => settings.projection([d.longitude, d.latitude])[0])
      .attr('cy', d => settings.projection([d.longitude, d.latitude])[1])
      .attr('r', '4px')
      .attr('class', 'circle point-dot')
      .style('fill', d => color(d.latitude))
      .style('opacity', 0.75)
      

  //UPDATE
  points.select('circle')
    .transition()
    .attr('r', '5px')
    .transition()
    .attr('r', '4px')
    .duration(300)
    .attr('cx', d => settings.projection([d.longitude, d.latitude])[0])        
    .attr('cy', d => settings.projection([d.longitude, d.latitude])[1])
    .style('stroke', 'orange')
   
  };
})();





