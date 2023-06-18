import { InjectionToken } from '@angular/core';

export interface PopoutData {
  modalName: PopoutModalName;
  text: string;
  sender?: string;
  addressee?: string;
  lot?: LotDto;
  leg?: LegsOfLineDto;
}

export const POPOUT_MODAL_DATA = new InjectionToken<{}>('POPOUT_MODAL_DATA');

export let POPOUT_MODALS = {};

export enum PopoutModalName {
  'LOT_QR' = 'LOT_QR',
  'CONSIGNMENTS' = 'CONSIGNMENTS',
}
