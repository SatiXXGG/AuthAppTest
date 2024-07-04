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
}
