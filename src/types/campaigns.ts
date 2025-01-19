export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Target {
  id: string;
  email: string;
  status: string;
  clicked: boolean;
  clicked_at: string | null;
}