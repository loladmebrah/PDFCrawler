import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {
  eventManager : EventEmitter;
  constructor(private storage: Storage) {
    this.eventManager = new EventEmitter();
    this.configEvents();
  }

  configEvents(){
    this.eventManager.on('LoadSources',(sources)=>{
      this.storage.set(sources.name, sources.data).then(()=>{
        this.eventManager.emit('SourcesLoaded');
      });
    });

    this.eventManager.on('DeletedSources',()=>{
      this.storage.remove('SOURCES');
    });
  }
}
