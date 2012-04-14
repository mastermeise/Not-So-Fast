chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	var blocked_websites, website, tabUrl = changeInfo.url;
	
	if(tabUrl && tabUrl.indexOf('?passed=true') == -1){
		tabUrl = tabUrl.replace('http://', '').replace('https://', '');
		blocked_websites = JSON.parse(localStorage.getItem('blocked_websites'));
		
		for(var i=0; i<blocked_websites.length; i++){
			website = blocked_websites[i];
			
			if(tabUrl.substring(0, website.length) == website){
				chrome.tabs.update(tab.id, {url: 'http://brianmeise.com/plugin?url=' + changeInfo.url});
			}
		}
	}
});