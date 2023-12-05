import { Capacitor } from '@capacitor/core';

export const ON_WEB = Capacitor.getPlatform() === 'web';
