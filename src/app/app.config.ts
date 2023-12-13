import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { boardReducer } from './board/board.reducer';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideClientHydration(),
        importProvidersFrom(StoreModule.forRoot({board:boardReducer})),
    ]
};
