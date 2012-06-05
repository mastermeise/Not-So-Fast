var notSoFast = {};
notSoFast.white_list = [];

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	var blocked_websites, website, tabUrl = changeInfo.url;
	
	//check where the tab is coming from for forwarded links
	if(tabUrl){
		for(var i=0; i<notSoFast.white_list.length; i++){
			if(notSoFast.white_list[i] == tabId){
				return;
			}
		}
		
		if(tabUrl.indexOf('?passed=true') == -1){
			tabUrl = tabUrl.replace('http://', '').replace('https://', '');
			blocked_websites = JSON.parse(localStorage.getItem('blocked_websites'));
			blocked_websites = (blocked_websites ? blocked_websites : []);
			
			for(var j=0; j<blocked_websites.length; j++){
				website = blocked_websites[j];
				
				if(website.on && tabUrl.substring(0, website.url.length) == website.url){
					chrome.tabs.update(tab.id, {url: 'chrome-extension://' + chrome.i18n.getMessage("@@extension_id") + '/quiz.html?url=' + changeInfo.url});
				}
			}
		}
		else if(tabUrl.indexOf('?passed=true') >= 0){
			notSoFast.white_list.push(tabId);
		}
	}
});