import { SubscriptableType } from 'src/app/models/subscriptable-type';

export interface DialogHeader {
  title?: string | SubscriptableType;
  icon?: string;
  iconType?: 'outline' | 'filled' | 'rounded' | 'sharp';
  alignment?: 'left' | 'center' | 'right';
}
