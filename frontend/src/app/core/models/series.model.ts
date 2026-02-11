export interface Series {
  id: number;
  study_id: number;
  series_uid: string;
  series_number: number;
  modality: string;
  description?: string;
  body_part_examined?: string;       // Added for dashboard
  instance_count: number;   // Added to show how many images are inside
  created_at: string;
}