import { NgModule, InjectionToken, APP_INITIALIZER, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwilioVideoService } from './twilio-video.service';
import { TwilioVideoComponent } from './twilio-video.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TwilioVideoComponent
    ],
    exports: [
        TwilioVideoComponent
    ],
    providers: [

    ]
})

export class TwilioVideoModule {
    constructor( @Optional() @SkipSelf() parentModule: TwilioVideoModule) {
    }

    static forRoot() {
        return {
            ngModule: TwilioVideoModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    deps: [TwilioVideoService],
                    useFactory: Factory,
                    multi: true
                }
            ]
        };
    }
}

export function Factory(twilioVideoService: TwilioVideoService) {
    return () => twilioVideoService;
}

