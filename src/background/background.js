const activeTabs = {};

chrome.tabs.onActivated.addListener(activeInfo => {
  if (!activeTabs[activeInfo.tabId]) {
    activeTabs[activeInfo.tabId] = Date.now();
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete' && !activeTabs[tabId]) {
    activeTabs[tabId] = Date.now();
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  delete activeTabs[tabId];
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTime' && sender.tab) {
    if (!activeTabs[sender.tab.id]) {
      activeTabs[sender.tab.id] = Date.now();
    }
    const startTime = activeTabs[sender.tab.id];
    sendResponse({ timeSpent: Date.now() - startTime });
  }
  
  if (request.action === 'resetTime') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        activeTabs[tabs[0].id] = Date.now();
        sendResponse({ success: true });
      }
    });
    return true; 
  }
  
  return true;
});