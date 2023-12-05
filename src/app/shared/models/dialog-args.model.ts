import { DialogActions } from './dialog-actions.model';
import { DialogHeader } from './dialog-header.model';

/** Interface that can be used to generically type a class. */
export type ComponentType<T> = new (...args: any[]) => T;
export type DialogArgs = {
  header?: DialogHeader;
  actions: DialogActions;
  data?: {
    [key: string]: any;
  };
  type?: 'info' | 'success' | 'warning' | 'error';
  maxHeight?: string;
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  cssClass?: string;
  dismissPrevious?: boolean;
} & (
  | { component: ComponentType<any> }
  | {
      content: string;
      contentAlignment?: 'left' | 'center' | 'right' | 'justify';
    }
);
