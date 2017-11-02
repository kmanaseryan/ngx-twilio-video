import { Observable, Observer } from 'rxjs/Rx';
import { Injectable, EventEmitter } from '@angular/core';
import * as Video from 'twilio-video';

@Injectable()
export class TwilioVideoService {
    onDetachTrack = new EventEmitter();
    onRemoteVideoAttach = new EventEmitter();
    onLocalVideoAttach = new EventEmitter();

    constructor() {
    }

    attachTrackToLocal(track: Track, selector?: string) {
        let element = track.attach(selector);
        this.onLocalVideoAttach.emit(element);
    }

    attachTrackToRemote(track: Track, selector?: string) {
        let element = track.attach(selector);
        this.onRemoteVideoAttach.emit(element);
    }

    detachTracksFromLocal(){
        this.onDetachTrack.emit('local');
    }

    detachTracksFromRemote(){
        this.onDetachTrack.emit('remote');
    }

    createLocalTracks(options?: LocalTrackOptions) {
        return new Observable((observer: Observer<Array<Track>>) => {
            Video.createLocalTracks(options)
                .then((localTracks) => {
                    let tracks = [];
                    localTracks.forEach((track)=>{
                        tracks.push(new Track(track));
                    })
                    observer.next(tracks);
                })
        })
    }

    connect(token: string, options: ConnectOptions) {
        return new Observable((observer: Observer<Room>) => {
            Video.connect(token, options)
                .then(function (room) {
                    observer.next(new Room(room));
                })
        });
    }
}

export class Room {
    participants: Array<Participant>;
    onParticipantConnected: EventEmitter<Participant>
    onParticipantDisconnected: EventEmitter<Participant>
    onDisconnect: EventEmitter<Room>
    
    constructor(public _nativeObject: any) {
        let self = this;

        this.onParticipantConnected = new EventEmitter();
        this.onParticipantDisconnected = new EventEmitter();
        this.onDisconnect = new EventEmitter();
        this.participants = [];

        _nativeObject.participants.forEach((participant)=>{
            self.participants.push(new Participant(participant));
        })
        _nativeObject.on('participantConnected', function (nativeParticipant) {
            let participant = new Participant(nativeParticipant);
            self.onParticipantConnected.emit(participant);
        });
        _nativeObject.on('participantDisconnected', function (nativeParticipant) {
            let participant = new Participant(nativeParticipant);
            self.onParticipantDisconnected.emit(participant);
        });
        _nativeObject.on('disconnected', room => {
            self.onDisconnect.emit(new Room(room));
        });
    }

    disconnect(){
        this._nativeObject.disconnect();
    }
}

export class Participant {
    onTrackAdded = new EventEmitter();
    tracks: Array<Track>;
    constructor(public _nativeObject: any) {
        this.tracks = [];
        let self = this;
        _nativeObject.tracks.forEach(track => {
            self.tracks.push(new Track(track));
        });
        _nativeObject.on('trackAdded', (nativeTrack) => {
            let track = new Track(nativeTrack);
            self.onTrackAdded.emit(track);
        });
    }
}

export class Track {
    id: string;
    kind: string;
    name: string;
    constructor(public _nativeObject: any) {
        this.id = _nativeObject.id;
        this.kind = _nativeObject.kind;
        this.name = _nativeObject.name;
    }

    attach(selector?: string) {
        return this._nativeObject.attach(selector);
    }

    stop(){
        this._nativeObject.stop();
    }
}


export interface LocalTrackOptions {
    audio?: boolean;

    logLevel?: string;

    video?: boolean | {
        width?: number,
        height?: number
    };
}

export interface ConnectOptions {
    audio?: boolean | LocalTrackOptions;
    iceServers?: Array<any>;
    iceTransportPolicy?: string;
    insights?: boolean;
    maxAudioBitrate?: number;
    maxVideoBitrate?: number;
    name?: string;
    preferredAudioCodecs?: Array<any>;
    preferredVideoCodecs?: Array<any>;
    logLevel?: any;
    tracks?: Array<any>;
    video?: boolean | LocalTrackOptions;

}