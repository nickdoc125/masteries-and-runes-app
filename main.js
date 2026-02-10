const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Σωστός ορισμός path για auto-save - πάντα ένα level πάνω
const getRunesJsonPath = () => {
  if (!app.isPackaged) {
    return path.join(__dirname, '..', 'runes.json');
  } else {
    const exeDir = path.dirname(process.execPath);
    const parentDir = path.dirname(exeDir);
    return path.join(parentDir, 'runes.json');
  }
};

// Κάνουμε το window global για να μην χρειάζεται να το δημιουργούμε από το μηδέν κάθε φορά
let mainWindow = null;

// Προ-φορτώνουμε modules
app.whenReady().then(() => {
  // Προ-load των απαραίτητων modules
  require('fs');
  require('path');
  
  // Δημιουργία window με μικρή καθυστέρηση
  setTimeout(createWindow, 100);
});

function createWindow() {
  // Αν υπάρχει ήδη window, απλά το εμφανίζουμε
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1162,
    height: 911,
    frame: true,
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    minimizable: true,
    show: false, // Αρχικά κρυφό για να φαίνεται αμέσως ready
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      // Βελτιστοποιήσεις για ταχύτητα
      backgroundThrottling: false,
      webgl: false,
      enablePreferredSizeMode: true
    }
  });

  // Προ-φορτώνουμε το HTML αμέσως
  mainWindow.loadFile('main.html');
  
  // Εμφάνιση μόλις το βασικό content φορτώσει (όχι όλες οι πηγές)
  mainWindow.webContents.once('dom-ready', () => {
    console.log('DOM ready - showing window');
    
    // Εφαρμογή zoom και CSS γρήγορα
    mainWindow.webContents.setZoomFactor(0.9);
    mainWindow.webContents.insertCSS(`
      ::-webkit-scrollbar { display: none !important; }
      body { -ms-overflow-style: none; scrollbar-width: none; }
    `);
    
    // Εκτέλεση του override script αμέσως
    mainWindow.webContents.executeJavaScript(`
      // Απλοποιημένο override - μόνο η βασική λειτουργία
      const originalApplyRunesAndMasteries = applyRunesAndMasteries;
      applyRunesAndMasteries = function() {
        try {
          runesData = getRunesData();
          masteriesData = getMasteriesData();

          if (!runesData || !masteriesData) {
            alert('Please configure both Runes and Masteries first');
            return;
          }

          const finalData = { 
            runes: runesData, 
            talents: masteriesData  // ΔΙΟΡΘΩΜΕΝΟ: talents αντί για talent
          };

          if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('save-runes-data', finalData);
            alert('Runes and Masteries applied successfully!\\\\nAuto-saved to parent folder');
          } else {
            const jsonData = JSON.stringify(finalData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'runes.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Success! runes.json file downloaded');
          }
        } catch (error) {
          alert('Error: ' + error.message);
        }
      }
      console.log('Fast override completed');
    `, true).catch(() => {}); // Αγνοούμε errors για ταχύτητα
    
    // Εμφάνιση παραθύρου αμέσως
    mainWindow.show();
    mainWindow.focus();
  });

  // Χειρισμός κλεισίματος παραθύρου
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Βελτιστοποίηση: κλείδωμα μεγέθους μετά την εμφάνιση
  mainWindow.once('ready-to-show', () => {
    mainWindow.setResizable(false);
    mainWindow.setMaximizable(false);
  });
}

// IPC handler - ΔΙΟΡΘΩΜΕΝΟ
ipcMain.on('save-runes-data', (event, data) => {
  try {
    // Χρησιμοποιούμε απευθείας τα data που έρχονται από το renderer
    const convertedData = {
      runes: data.runes,
      talents: data.talents  // ΔΙΟΡΘΩΜΕΝΟ: data.talents αντί για data.talent
    };
    
    const RUNES_JSON_PATH = getRunesJsonPath();
    const dir = path.dirname(RUNES_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RUNES_JSON_PATH, JSON.stringify(convertedData, null, 2));
    console.log('Saved runes.json with structure:', Object.keys(convertedData));
  } catch (error) {
    console.error('Save error:', error);
  }
});

// Χειρισμός activate event (macOS) - γρήγορο restore
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Απενεργοποίηση hardware acceleration αν προκαλεί προβλήματα
// app.disableHardwareAcceleration();

// Βελτιστοποίηση memory usage
app.commandLine.appendSwitch('--disable-renderer-backgrounding');
app.commandLine.appendSwitch('--disable-background-timer-throttling');