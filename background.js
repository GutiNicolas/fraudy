chrome.browserAction.onClicked.addListener(function (tab) {
        // ...if it matches, send a message specifying a callback too
    chrome.tabs.sendMessage(tab.id, {text: 'scan_now'}, read_columns);
});

chrome.runtime.onMessage.addListener(data => {
  if (data.type === 'notification') {
    chrome.notifications.create('', data.options);
  }
});

function read_columns (evt) {
    console.log("Finish");
}