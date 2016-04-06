app.factory('Model', function () {
	var messageToWorld = "Sug min röv!";

	this.getMessage = function(){
		return messageToWorld;
	}

	return this;
});