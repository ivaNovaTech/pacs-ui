import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as dcmjs from 'dcmjs';

@Component({
  selector: 'app-image-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="viewer-container" (wheel)="onWheelScroll($event)">
      <div class="metadata-overlay" *ngIf="activeDataset">
        <div class="top-left">
          <p class="db-source">
            <i class="bi bi-database-fill"></i> 
            <strong>PATIENT:</strong> {{ images[currentIndex]?.patient_name }}
          </p>
          <p class="db-source">
            <i class="bi bi-database-fill"></i> 
            <strong>MRN:</strong> {{ images[currentIndex]?.mrn }}
          </p>
          <p class="dicom-source">
            <i class="bi bi-file-earmark-medical"></i> 
            <strong>MODALITY:</strong> {{ activeDataset.Modality || images[currentIndex]?.modality }}
          </p>
        </div>

        <div class="top-right text-end">
          <p class="dicom-source">
            <strong>STUDY YEAR:</strong> {{ images[currentIndex]?.study_year }}
            <i class="bi bi-file-earmark-medical ms-1"></i>
          </p>
          <p class="db-source">
            <strong>ACCESSION:</strong> {{ images[currentIndex]?.accn_num }} 
            <i class="bi bi-database-fill ms-1"></i>
          </p>
        </div>

        <div class="bottom-left">
          <p class="dicom-source small">
            <strong>UID:</strong> {{ images[currentIndex]?.image_uid }}
          </p>
          <p class="mt-1">
            <strong>IMAGE:</strong> {{ currentIndex + 1 }} / {{ images.length }} 
            (Inst: {{ images[currentIndex]?.instance_number }})
          </p>
          <div class="id-specs mt-1">
            <span>RES: {{ images[currentIndex]?.columns }}x{{ images[currentIndex]?.rows }}</span> | 
            <span>TSUID: {{ images[currentIndex]?.transfer_syntax_uid }}</span>
          </div>
        </div>
      </div>
      
      <canvas #dicomCanvas></canvas>

      <div class="loading-overlay" *ngIf="isLoading">
        <div class="spinner-border text-light spinner-border-sm"></div>
        <span class="ms-2">Loading DICOM...</span>
      </div>
    </div>
  `,
  styles: [`
    .viewer-container {
      position: relative;
      width: 100%;
      height: 85vh;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border: 1px solid #333;
    }
    canvas { 
      max-width: 100%; 
      max-height: 100%; 
      image-rendering: pixelated; 
    }
    .metadata-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      pointer-events: none;
      padding: 20px;
      z-index: 5;
      text-shadow: 1px 1px 2px #000;
    }
    .top-left { position: absolute; top: 15px; left: 20px; }
    .top-right { position: absolute; top: 15px; right: 20px; }
    .bottom-left { position: absolute; bottom: 15px; left: 20px; }
    
    .db-source { color: #a3ffa3; margin-bottom: 2px; }
    .dicom-source { color: #00ff00; margin-bottom: 2px; }
    .id-specs { font-size: 11px; color: #00cccc; }

    .loading-overlay {
      position: absolute;
      color: white;
      background: rgba(0,0,0,0.6);
      padding: 10px 20px;
      border-radius: 20px;
      z-index: 10;
    }
  `]
})
export class ImageDashboardComponent implements OnInit {
  @ViewChild('dicomCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  @Input() images: any[] = []; 
  
  @Input() patientId?: string | number;
  @Input() studyId?: string | number;
  @Input() seriesId?: string | number;

  currentIndex = 0;
  activeDataset: any = null;
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.images && this.images.length > 0) {
      this.sortAndLoad();
    } else if (this.patientId && this.studyId && this.seriesId) {
      this.fetchImageList();
    }
  }

  fetchImageList() {
    this.isLoading = true;
    const url = `/api/patients/${this.patientId}/studies/${this.studyId}/series/${this.seriesId}/images`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.images = data;
        this.sortAndLoad();
      },
      error: () => this.isLoading = false
    });
  }

  sortAndLoad() {
    // Sort by instance_number to ensure correct stack order
    this.images.sort((a, b) => (a.instance_number || 0) - (b.instance_number || 0));
    this.loadActiveSlice();
  }

  onWheelScroll(event: WheelEvent) {
    event.preventDefault();
    if (this.images.length <= 1 || this.isLoading) return;

    if (event.deltaY > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
    this.loadActiveSlice();
  }

  async loadActiveSlice() {
    const imgData = this.images[this.currentIndex];
    if (!imgData?.image_url) return;

    this.isLoading = true;
    try {
      const buffer = await this.http.get(imgData.image_url, { responseType: 'arraybuffer' }).toPromise();
      if (!buffer) throw new Error("Empty DICOM");

      const dicomDict = dcmjs.data.DicomMessage.readFile(buffer);
      const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomDict.dict);
      
      let pixelData = dataset.PixelData;
      if (Array.isArray(pixelData)) pixelData = pixelData[0];

      this.activeDataset = dataset;
      this.renderCanvas(dataset, pixelData);
    } catch (err) {
      console.error("Render error:", err);
    } finally {
      this.isLoading = false;
    }
  }

  renderCanvas(dataset: any, pixelData: any) {
    if (!this.canvasRef || !pixelData) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = dataset.Columns || 512;
    canvas.height = dataset.Rows || 512;

    const slope = dataset.RescaleSlope || 1;
    const intercept = dataset.RescaleIntercept || 0;
    const wc = Array.isArray(dataset.WindowCenter) ? dataset.WindowCenter[0] : (dataset.WindowCenter || 127);
    const ww = Array.isArray(dataset.WindowWidth) ? dataset.WindowWidth[0] : (dataset.WindowWidth || 255);

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const pixelArray = dataset.BitsAllocated === 8 ? new Uint8Array(pixelData) : new Int16Array(pixelData);
    const lowBound = wc - ww / 2;

    for (let i = 0; i < pixelArray.length; i++) {
      const val = pixelArray[i] * slope + intercept;
      let brightness = ((val - lowBound) / ww) * 255;
      brightness = Math.min(Math.max(brightness, 0), 255);

      const idx = i * 4;
      imageData.data[idx] = brightness;
      imageData.data[idx + 1] = brightness;
      imageData.data[idx + 2] = brightness;
      imageData.data[idx + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }
}