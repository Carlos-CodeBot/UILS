import { DialogHeader } from '../../../models/dialog-header.model';
import { Option } from './select-option.model';

export interface SelectArgs {
  /**
   * text to show on the select, should be a i18n key
   */
  placeholder: string;
  /**
   * options for the select
   */
  options: Option[];
  /**
   * intial selected option for the select
   */
  initialOption?: Option;
  /**
   * options for the header of the modal
   */
  headerOpts: DialogHeader;

  /**
   * text under the select
   */
  helperText?: string;
}
