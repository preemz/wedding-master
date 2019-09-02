// notification lib
// var myNotification;

// ready
$(function() {

	var myUI;
	var myMap;

	// UI Interaction
	myUI = new Wedding.UIComponents();
	myMap = new Wedding.MapInteraction();

	// initialize ui & map component
	myUI.init();
	myMap.init();
});
