const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Add any Node.js functionality you want to expose to the renderer process
}); 