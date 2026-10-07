import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { PRIMENG_TRANSLATION_ES } from './core/config/primeng-es';

const UgelPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#EEF2FA',
      100: '#D3DEF2',
      200: '#A7BEE5',
      300: '#7B9DD8',
      400: '#4A7AC7',
      500: '#0D1B4C',
      600: '#0A1640',
      700: '#081233',
      800: '#060D26',
      900: '#040919',
      950: '#020510',
    },
  },
  components: {
    floatlabel: {
      root: {
        fontWeight: '400',
        active: {
          fontWeight: '400',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: UgelPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
      translation: PRIMENG_TRANSLATION_ES,
    }),
  ],
};
