export type ContentType = 'profile' | 'photo' | 'message' | 'livestream';

export interface Policy {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  rules: string[];
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PolicyCreateInput {
  name: string;
  description: string;
  contentType: ContentType;
  rules: string[];
  isActive: boolean;
}

export interface PolicyUpdateInput {
  id: string;
  name?: string;
  description?: string;
  contentType?: ContentType;
  rules?: string[];
  isActive?: boolean;
}
