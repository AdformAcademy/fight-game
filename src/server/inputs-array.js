function InputsArray () {
	this.inputs = [];
}

InputsArray.prototype.getLength = function() {
	return this.inputs.length;
}

InputsArray.prototype.get = function(index) {
	return this.inputs[index];
}

InputsArray.prototype.push = function(data) {
	console.log('pushed: ' + data);
	this.inputs.push(data);
}

InputsArray.prototype.shift = function() {
	this.inputs.shift();
}

module.exports = InputsArray;