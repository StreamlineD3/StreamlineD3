/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

//common.js format

//-----------TO START BUNDLE
// $ webpack

// var module1 = require("./f1.js");

// var module2 = require("./f2.js");

// var module3 = require("./f3.js");

var module4 = __webpack_require__(2);

// var module5 = require("./f5.js");

// var module6 = require("./f6.js");

var module7 = __webpack_require__(3);

var module8 = __webpack_require__(4);

var module9 = __webpack_require__(5);

var module10 = __webpack_require__(1);

// var module11 = require("./f11.js");


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = 

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

    //removes old div so don't keep adding indefinitely
    $("#json-viewer").replaceWith("<div id='json-viewer'></div>")

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
        //adds json data to rectangle below graph
        $("#json-viewer").prepend( "<span class='json-stats'>" + data[i].xScale + ": " + (Math.round(data[i].volume * 100) / 100) + "<span>");

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



/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = 

(function () {
	let currData = [];
	const socket = io.connect();

	//set initial SVG params
	let margin = { top: 20, right: 20, bottom: 25, left: 20 };
	let width = 700 - margin.left - margin.right;
	let height = 500 - margin.top - margin.bottom;

	let svg;

	drawGrid([{ setWidth: 700, setHeight: 500 }]);

	socket.on('sendBubbleData', (data) => {
		//check if data is the same
		if (isNewData(currData, data)) {
			currData = data;
			drawGrid(data);
			drawContent(data, svg);
		}

	});

	function drawGrid(data) {

		width = data[0].setWidth - margin.left - margin.right;
		height = data[0].setHeight - margin.top - margin.bottom;

		d3.select('#bubbleSVG').remove();


		svg = d3.select('#bubble-graph')

			.append('svg')
			.attr('id', 'bubbleSVG')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	}

	function drawContent(data, svg) {

		var radiusScale = d3.scaleSqrt().domain([0, 10]).range([0, 50])

		var simulation = d3.forceSimulation()
			.force('x', d3.forceX(0).strength(.1))
			.force('Y', d3.forceY(0).strength(.1))
			.force('collide', d3.forceCollide(d => radiusScale(d.volume)))

		var circles = svg
			.selectAll('.word')
			.data(data)
			.enter()
			.append('g')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

		circles.append('circle')
			.attr('r', d => radiusScale(d.volume))
			.style('fill', d => d.color)
			.attr('class', 'word')
			.style('fill-opacity', .8)
			.attr('id', d => 'c' + d.text)
			.attr('cx', width / 2)
			.attr('cy', height / 2)

		circles.append('text')
			.style('text-anchor', 'middle')
			.style('fill', 'black')
			.style('font-size', '16px')
			.attr('y', 4)
			.text(d => d.text)
			.append('text');


		simulation.nodes(data)
			.on('tick', ticked)

		function ticked() {
			svg.selectAll('circle')
				.attr('cx', d => d.x)
				.attr('cy', d => d.y);

			svg.selectAll('text')
				.attr('dx', d => d.x)
				.attr('dy', d => d.y);
		}
	}

	function isNewData(a, b) {
		if (a.length !== b.length) { return true };

		for (let i = 0; i < a.length; i += 1) {
			if (a[i].text === b[i].text && a[i].volume !== b[i].volume) {
				return true;

			} else if (a[i].text !== b[i].text) {
				return true;
			};
		}
		return false;
	}
})();



/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = 

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









/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = 

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








/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = 

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




/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
