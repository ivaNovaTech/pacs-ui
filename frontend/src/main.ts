import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// No Cornerstone initialization needed here anymore.
// We are handling DICOM parsing and rendering directly in the component.

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));