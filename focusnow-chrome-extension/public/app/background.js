// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {

   // Opens a new tab
   chrome.tabs.create({url: "index.html"});
});