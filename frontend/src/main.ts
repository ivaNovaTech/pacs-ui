import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

// 1. Attach to window for global access
(window as any).cornerstone = cornerstone;
(window as any).cornerstoneWADOImageLoader = cornerstoneWADOImageLoader;
(window as any).dicomParser = dicomParser;

// 2. Link the loader to the dependencies (THIS IS THE MISSING PIECE)
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// 3. Optional: Configure the web worker path if you encounter performance issues later
// For now, we use the main thread execution
cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr: any) {
    // This is useful if you need to add Auth tokens to headers later
  }
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));