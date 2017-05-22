//Copyright (c) 2014 The Chromium Authors. All rights reserved.
//Use of this source code is governed by a BSD-style license that can be
//found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
	// Query filter to be passed to chrome.tabs.query - see
	// https://developer.chrome.com/extensions/tabs#method-query
	var queryInfo = {
			active: true,
			currentWindow: true
	};


	chrome.tabs.query(queryInfo, function(tabs) {
		// chrome.tabs.query invokes the callback with a list of tabs that match the
		// query. When the popup is opened, there is certainly a window and at least
		// one tab, so we can safely assume that |tabs| is a non-empty array.
		// A window can only have one active tab at a time, so the array consists of
		// exactly one tab.
		var tab = tabs[0];

		// A tab is a plain object that provides information about the tab.
		// See https://developer.chrome.com/extensions/tabs#type-Tab
		var url = tab.url;

		// tab.url is only available if the "activeTab" permission is declared.
		// If you want to see the URL of other tabs (e.g. after removing active:true
		// from |queryInfo|), then the "tabs" permission is required to see their
		// "url" properties.
		console.assert(typeof url == 'string', 'tab.url should be a string');

		callback(url);
	});
}
/*
function getCurrentTabUrl(callback) {
	var queryInfo = {
			active: true,
			currentWindow: true
	};


	chrome.tabs.query(queryInfo, function(tabs) {
		var tab = tabs[0];
		var url = tab.url;
		console.assert(typeof url == 'string', 'tab.url should be a string');

		callback(url);
	});
}
 */
function render_url_Status(statusText) {
	document.getElementById('url_status').textContent = statusText;
}


function render_html_scan_Status(statusText) {
	document.getElementById('html_status').textContent = statusText;
}


chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action == "getSource") {
		var html_body = request.source;
		
		var html_report = "\nHTML Source Code: \n";
		
		if(String(request.source).includes("malware"))
		{
			render_html_scan_Status("MALICIOUS MY DUDE!!!" + html_report + html_body);
		}
		else if(String(request.source).includes("test"))
		{
			render_html_scan_Status("Test reached\n" + html_report + html_body);
		}
		else if(String(request.source).includes("google"))
		{
			render_html_scan_Status("Google is part of this..." + html_report + html_body);
		}
		else
			render_html_scan_Status("All Good\n");
		//html_status.innerText = "End of HTML Scan Report";
		
		
	}
});

function onWindowLoad() {

	var html_status = document.querySelector('html_status');

	chrome.tabs.executeScript(null, {
		file: "getPagesSource.js"
	}, function() {
		// If you try and inject into an extensions page or the webstore/NTP you'll get an error
		if (chrome.runtime.lastError) {
			html_status.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
	getCurrentTabUrl(function(url) {
		render_url_Status('String check ');

		if(String(url).includes("malware"))
		{
			render_url_Status("MALICIOUS MY DUDE!!!\n");
		}
		else if(String(url).includes("test"))
		{
			render_url_Status("Test Check Reached");	
		}
		else
		{
			render_url_Status("Seems Safe");
		}

	});

	window.onload = onWindowLoad;
});


