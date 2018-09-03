// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {

    //set
    chrome.storage.local.clear();
    chrome.storage.local.set({"lastUpdate": new Date('1995-12-17T03:24:00').toString()});

    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {urlContains: 'https://focusk12.polk-fl.net/focus/Modules.php'},
                    })
                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});