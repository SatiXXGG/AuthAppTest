export interface userData {
  username?: string;
  password?: string;
  email?: string;
  id?: string;
  description?: string;
  image?: BufferSource;
  created_at?: string;
  original_user?: string;
}

export interface fetchResult {
  success: boolean;
  data: userData;
  message?: string;
}

export interface appData {
  title: string;
  description: string;
  created_at: string;
  id: string;
}

export interface fetchAppResult {
  success: boolean;
  data: appData[];
  message?: string;
}

export interface fetchSingleAppResult {
  success: boolean;
  data: appData;
  message?: string;
}

export interface ticket {
  content: string;
  created_at: string;
  unique_id: string;
}
