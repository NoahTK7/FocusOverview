// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {

    //set active value true
    chrome.storage.local.set({"active": true});

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