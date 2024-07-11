import { Injectable } from '@angular/core';
import { SessionRepository } from './session.repository';
import { User } from '../../../shared/entity/entity';
import { Session } from './session.interface';

@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(
    private sessionRepository: SessionRepository,
  ) {}

  public updateSession(session: Session) {
    this.sessionRepository.update({ session });
  }

  public updateUser(user: User) {
    this.sessionRepository.updateUser({ currentUser: user });
  }

  public logout() {
    this.sessionRepository.update({ session: undefined });
    this.sessionRepository.updateUser({ currentUser: undefined });
  }

  getCurrentUser() {
    return this.sessionRepository.currentUser();
  }
}
