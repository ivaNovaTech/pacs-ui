import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { interval, Subscription, of } from 'rxjs';
import { startWith, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isApiConnected: boolean = false;
  isDbConnected: boolean = false;
  showMobileDisclaimer: boolean = false; // Added for the expandable link
  lastSyncTime: string = 'Pending...';
  currentYear: number = new Date().getFullYear();

  systemStats = {
    cpu_usage: 0,
    ram_used: '0 / 0 MB',
    disk_used: '0 / 0 GB',
    disk_usage: 0
  };

  private healthSub?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.healthSub = interval(10000).pipe(
      startWith(0),
      switchMap(() => 
        this.http.get<any>('/api/system-health/').pipe(
          catchError(err => {
            console.error('PACS API Offline:', err);
            this.isApiConnected = false;
            this.isDbConnected = false;
            return of(null);
          })
        )
      )
    ).subscribe((data) => {
      if (data) {
        this.isApiConnected = true;
        this.isDbConnected = data.status === 'online';

        if (this.isDbConnected) {
          this.lastSyncTime = new Date().toLocaleTimeString();
        }

        this.systemStats = {
          cpu_usage: data.cpu_usage || 0,
          ram_used: (data.ram_used && data.ram_total) 
                   ? `${data.ram_used} / ${data.ram_total} MB` 
                   : '0 / 0 MB',
          disk_used: (data.disk_used && data.disk_total)
                   ? `${data.disk_used} / ${data.disk_total} GB`
                   : '0 / 0 GB',
          disk_usage: data.disk_usage || 0
        };
      }
    });
  }

  ngOnDestroy() {
    if (this.healthSub) this.healthSub.unsubscribe();
  }
}