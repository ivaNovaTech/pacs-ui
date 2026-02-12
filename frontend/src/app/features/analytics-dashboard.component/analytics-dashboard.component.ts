import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './analytics-dashboard.component.html',
  styles: [`
    .chart-box { position: relative; width: 100%; display: block; }
    .card { border-radius: 10px; transition: transform 0.2s; }
    .border-primary { border-left: 4px solid #4e73df !important; }
    .font-monospace { font-family: 'Courier New', Courier, monospace; }
  `]
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('modalityChart') modalityChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('yearChart') yearChart!: ElementRef<HTMLCanvasElement>;

  // Properties to satisfy template and production build
  public stats: any = null;
  public isLoading: boolean = true;
  public isApiConnected: boolean = false;
  public currentYear: number = new Date().getFullYear();
  
  private charts: Chart[] = [];

  constructor(private http: HttpClient) {}

  @HostListener('window:resize')
  onResize() {
    if (this.charts.length > 0 && window.innerWidth >= 992) {
      this.charts.forEach(c => c.resize());
    }
  }

  returnZero() {
    return 0;
  }
  
  ngOnInit(): void {
    this.fetchStats();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private destroyCharts() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  fetchStats() {
    this.isLoading = true;
    this.http.get(`${environment.apiUrl}/api/studies/stats`).subscribe({
      next: (data: any) => {
        this.stats = data;
        this.isApiConnected = true;
        this.isLoading = false;
        
        // Only initialize charts if we are on a desktop-sized screen
        if (window.innerWidth >= 992) {
          setTimeout(() => this.createCharts(), 150);
        }
      },
      error: (err) => {
        console.error('Stats Load Error:', err);
        this.isApiConnected = false;
        this.isLoading = false;
      }
    });
  }

  createCharts() {
    this.destroyCharts();

    if (!this.modalityChart || !this.yearChart) return;

    try {
      // 1. Modality Doughnut
      this.charts.push(new Chart(this.modalityChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: Object.keys(this.stats.modalities || {}),
          datasets: [{
            data: Object.values(this.stats.modalities || {}),
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
            hoverOffset: 4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));

      // 2. Monthly Line Chart
      this.charts.push(new Chart(this.yearChart.nativeElement, {
        type: 'line',
        data: {
          labels: Object.keys(this.stats.monthly || {}),
          datasets: [{
            label: 'Studies',
            data: Object.values(this.stats.monthly || {}),
            borderColor: '#4e73df',
            backgroundColor: 'rgba(78, 115, 223, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      }));
    } catch (e) {
      console.error('Chart creation failed', e);
    }
  }
}