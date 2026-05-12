/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  status: 'draft' | 'published';
  imageUrl?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'user';
  bio?: string;
}

export interface SliderSlide {
  imageUrl: string;
  title?: string;
  description?: string;
}

export interface PortalSettings {
  primaryColor: string;
  headerImageUrl?: string;
  headerTitle: string;
  sliderImages?: string[]; // Keep for compatibility if needed, but we'll prefer slides
  slides?: SliderSlide[];
}

export type ViewType = 'dashboard' | 'info-kita' | 'admin-write' | 'settings';
