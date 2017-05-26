class Streamline {
	constructor(server, port) {
		this.io = require('socket.io').listen(server);
		this.connections = [];
		this.server = server;
	}
​
	connect(func) {
			this.io.sockets.on('connection', (socket) => {
				let newSocket = socket;
				this.connections.push(socket);
				console.log('CONNECTED: %s SOCKETS CONNECTED', this.connections.length)
​
				socket.on('disconnect', (data) => {
					this.connections.splice(this.connections.indexOf(socket), 1);
					console.log('CONNECTED: %s SOCKETS CONNECTED', this.connections.length);
				});
				
				return func(socket);
​
			});
		}
​
	line(socket, data, config) {
​
		let emitData = [];
		let emitConfig = {};
		let refConfig = {
			setWidth: 700,
			setHeight: 500,
			shiftXAxis: true,
			xDomainUpper: 20,
			xDomainLower: 0,
			yDomainUpper: 40,
			yDomainLower: 0,
			xTicks: 10,
			yTicks: 10,
			xScale: '',
			yScale: '',
			xLabel_text: '',
			yLabel_text: '',
			lineColor: '',
			dotColor: ''
		};
​
		for (let key in config) {
			refConfig[key] = config[key];
		}
​
		setInterval(() => {
			for (let i = 0; i < data.length; i += 1) {
				emitConfig = Object.assign({}, refConfig);
​
				emitConfig.xScale = data[i][emitConfig.xScale];
				emitConfig.yScale = data[i][emitConfig.yScale];
​
				emitData.push(emitConfig);
			}
			if (emitData.length >= emitConfig.xDomainUpper) {
				emitData = emitData.slice(-(emitConfig.xDomainUpper));
			}
​
			socket.emit('sendLineData', emitData);
			emitData = [];
		}, 5000);
	}
​
	pie(socket, data, config) {
​
		let emitData = [];
		let emitConfig = {};
​
		let refConfig = {
​
			setWidth: '',
			setHeight: '',
			category: '',
			count: ''
		};
​
		for (let key in config) {
			refConfig[key] = config[key];
		}
​
		setInterval(() => {
			for (let i = 0; i < data.length; i += 1) {
​
				emitConfig = Object.assign({}, refConfig);
​
				emitConfig.category = data[i][emitConfig.category];
				emitConfig.count = data[i][emitConfig.count];
				emitData.push(emitConfig);
			}
​
			socket.emit('sendPieData', emitData);
			emitData = [];
		}, 5000);
	}
​
	map(socket, data, config) {
  
		let emitData = [];
		let emitConfig = {};
​
		let refConfig = {
			setWidth: 700,          
 		setHeight: 700,         
 		latitude: '',
 		longitude: '',
 		propOne: '',
 		propTwo: '',
			color: ''
		};
  
		for (let key in config) {
			refConfig[key] = config[key];
		}
		
		setInterval(() => {
			for (let i = 0; i < data.length; i += 1) {
				
				emitConfig = Object.assign({}, refConfig);
				emitConfig.latitude = data[i][emitConfig.latitude];
				emitConfig.longitude = data[i][emitConfig.longitude];
				emitConfig.propOne = data[i][emitConfig.propOne];
				emitConfig.propTwo = data[i][emitConfig.propTwo];
				emitData.push(emitConfig);
			}
			socket.emit('sendMapData', emitData);
			emitData = [];
		}, 5000);
	}
​
	scatter(socket, data, config) {
		let emitData = [];
		let emitConfig = {};
​
		let refConfig = {
			setWidth: 960,
			setHeight: 500,
			xDomainUpper: 20,
			xDomainLower: 0,
			yDomainUpper: 40,
			yDomainLower: 0,
			xTicks: 10,
			yTicks: 10,
			xScale: '',
			yScale: '',
			xLabel_text: '',
			yLabel_text: '',
			circle_text: '',
			id: '',
		};
​
		for (let key in config) {
			refConfig[key] = config[key];
		}
​
		setInterval(() => {
			for (let i = 0; i < data.length; i += 1) {
				emitConfig = Object.assign({}, refConfig);
				emitConfig.xScale = data[i][emitConfig.xScale];
				emitConfig.yScale = data[i][emitConfig.yScale];
				emitConfig.volume = data[i][emitConfig.volume];
				emitConfig.circle_text = data[i][emitConfig.circle_text];
				emitConfig.id = data[i][emitConfig.id];
				emitData.push(emitConfig);
			}
			socket.emit('sendScatterData', emitData);
			emitData = [];
		}, 5000);
	}
​
	wordCloud(socket, config) {
​
		let refConfig = {
			colors: '',
			colorDomain: '',
			font: '',
			fontSize: '',
			padding: '',
			rotate: '',
			height: '',
			width: '',
		};
​
		for (let key in config) {
			refConfig[key] = config[key];
		}
​
		let emitConfig = Object.assign({}, refConfig);
​
		socket.emit('send custom', emitConfig);
​
		socket.on('send audioText', (data) => {
			socket.emit('send audioData', data);
		});
	}
​
	bubbleGraph(socket, data, config) {
​
		let emitConfig = {};
		let emitData = [];
​
		let refConfig = {
			setWidth: 700,
			setHeight: 500,
			counter: '',
			text: '',
			volume: '',
			color:'',
		};
​
		for (let key in config) {
			refConfig[key] = config[key];
		}
​
		setInterval(() => {
			for (let i = 0; i < data.length; i += 1) {
				emitConfig = Object.assign({}, refConfig);
​
				emitConfig.text = data[i][emitConfig.text];
				emitConfig.volume = data[i][emitConfig.volume];
				emitData.push(emitConfig);
			}
			
			socket.emit('sendBubbleData', emitData);
			emitData = [];
		}, 5000);
	}
​
	bar(socket, data, config) {
		let emitConfig = {};
		let emitData = [];
​
		let refConfig = {
			setWidth: '',
			setHeight: '',
			shiftYAxis: true,
			xDomainUpper: 20,
			xDomainLower: 0,
			yDomainUpper: 100,
			yDomainLower: 0,
			xTicks: 10,
			yTicks: 50,
			xScale: '',
			volume: '',
			yLabel_text: '',
			label_text_size: 20,
			transition_speed: 1000,
			color: ['black']
		};
​
		for (let key in config) {
			refConfig[key] = config[key];
		}
​
		setInterval(() => {
			for (let i = 0; i < data.length; i += 1) {
				emitConfig = Object.assign({}, refConfig);
​
				emitConfig.xScale = data[i][emitConfig.xScale];
				emitConfig.volume = data[i][emitConfig.volume];
				emitConfig.id = 'rectangle-' + i;
				emitData.push(emitConfig);
			}
			socket.emit('sendBarData', emitData);
			emitData = [];
		}, 5000);
	}
}
​
module.exports = Streamline;