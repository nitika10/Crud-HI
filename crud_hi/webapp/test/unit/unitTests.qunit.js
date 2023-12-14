/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comcrudhi/crud_hi/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
