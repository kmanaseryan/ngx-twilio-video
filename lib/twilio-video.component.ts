import { Component, ViewChild, ViewEncapsulation, ElementRef, Input, OnInit } from '@angular/core';

import { TwilioVideoService } from './twilio-video.service';

@Component({
    selector: 'twilio-video',
    templateUrl: './twilio-video.component.html',
    styleUrls: ['./twilio-video.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TwilioVideoComponent implements OnInit {
    @Input('type') type: string;
    @ViewChild('video') video: ElementRef;
    constructor(
        private twilioVideoService: TwilioVideoService
    ) {}

    ngOnInit() {
        if(this.type === 'local'){
            this.twilioVideoService.onLocalVideoAttach
            .subscribe((element)=>{
                this.video.nativeElement.appendChild(element); 
            })
        }
        if(this.type === 'remote'){
            this.twilioVideoService.onRemoteVideoAttach
            .subscribe((element)=>{
                this.video.nativeElement.appendChild(element); 
            })
        }
        this.twilioVideoService.onDetachTrack.subscribe((from)=>{
            if(from === this.type)
                this.video.nativeElement.innerHTML = '';
        })
    }

}
