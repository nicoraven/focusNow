// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {

    // Opens a new tab
    chrome.tabs.create({url: "index.html"});

});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
        // alert('creating storage!');
        chrome.storage.sync.get(['list'], function(result) {
            // result.store will be either the stored value, or undefined if nothing is set
            if (result.store === undefined) {
                // alert('store not created yet');
                // chrome.storage.sync.set({list: [], deletedList: []}, function() {
                chrome.storage.sync.set({
                    list: {
                        "pending": [],
                        "completed": []
                    }
                }, function() {
                // The value is now stored, so you don't have to do this again
                // alert('storage created!');
                });
                chrome.storage.sync.set({
                    background: "#3EB690",
                    quote: "It's time to take charge of your life."
                }, function() {
                // The value is now stored, so you don't have to do this again
                // alert('background and quote set!');
                });
            }
        });
    } else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        chrome.storage.sync.set({
            quote: "It's time to take charge of your life."
        }, function() {
        // The value is now stored, so you don't have to do this again
        // alert('quote set!');
        });
    }
});