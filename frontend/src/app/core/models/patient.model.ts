export interface Patient {
  id: number;
  mrn: string;
  last_name: string;      // Match the JSON
  first_name: string;     // Match the JSON
  middle_name: string;    // Match the JSON
  sex: string;
  date_of_birth: string;  // Match the JSON
  suffix: string;
  prefix: string;
  created_at: string;
  last_updated_at: string;
}