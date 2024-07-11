import { Injectable } from '@angular/core';
import { SessionRepository } from './session.repository';
import {Profile, User} from '../../../shared/entity/entity';
import { Session } from './session.interface';

@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(
    private sessionRepository: SessionRepository,
  ) {}

  get employee() {
    return this.sessionRepository.employee$;
  }

  get user() {
    return this.sessionRepository.user$;
  }

  public updateSession(session: Session) {
    this.sessionRepository.update({ session });
  }

  public updateUser(user: User) {
    this.sessionRepository.updateUser({ currentUser: user });
  }

  public updateEmployee(employee: Profile) {
    this.sessionRepository.updateEmployee({ employee });
  }

  public logout() {
    this.sessionRepository.update({ session: undefined });
    this.sessionRepository.updateUser({ currentUser: undefined });
  }

  getCurrentUser() {
    return this.sessionRepository.currentUser();
  }

  getLoggedInEmployee() {
    return this.sessionRepository.employee();
  }
}
