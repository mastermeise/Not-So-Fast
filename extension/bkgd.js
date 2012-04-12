chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.url == 'http://www.facebook.com/' || changeInfo.url == 'https://www.facebook.com/'){
		chrome.tabs.update(tab.id, {url: 'http://brianmeise.com/plugin?url=' + changeInfo.url});
	}
});