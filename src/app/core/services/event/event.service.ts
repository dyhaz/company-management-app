import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventSubjects: { [key: string]: Subject<any> } = {};

  constructor() { }

  emitEvent(eventType: string, event: any) {
    if (!this.eventSubjects[eventType]) {
      this.eventSubjects[eventType] = new Subject<any>();
    }
    this.eventSubjects[eventType].next(event);
  }

  getEvents(eventType: string): Observable<any> {
    if (!this.eventSubjects[eventType]) {
      this.eventSubjects[eventType] = new Subject<any>();
    }
    return this.eventSubjects[eventType].asObservable();
  }
}
