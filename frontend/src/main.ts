import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // This looks into the app folder
import { AppComponent } from './app/app.component';

// Do NOT import routes here. appConfig handles that.

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));