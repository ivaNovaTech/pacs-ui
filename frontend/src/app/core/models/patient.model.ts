export interface Patient {
  id: number;              // Database primary key
  mrn: string
  last_name: string;      
  first_name: string;
  middle_name?: string;
  suffix: string;
  sex?: string;
  date_of_birth?: Date;
  created_at: string;      
  last_updated_at: string;
}