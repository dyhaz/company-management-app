import { createStore, select, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { Session } from './session.interface';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { User } from '../../../shared/entity/entity';

interface SessionState {
  session: Session | undefined;
}

interface UserState {
  currentUser: User | undefined;
}

const sessionStateInit: SessionState = {
  session: undefined,
};

const userStateInit: UserState = {
  currentUser: undefined,
};

const sessionStore = createStore({ name: 'session' }, withProps<SessionState>(sessionStateInit));

const userStore = createStore({ name: 'currentUser' }, withProps<UserState>(userStateInit));

export const persist = persistState(sessionStore, {
  key: 'session',
  storage: localStorageStrategy,
});

export const persist2 = persistState(userStore, {
  key: 'currentUser',
  storage: localStorageStrategy,
});

@Injectable({ providedIn: 'root' })
export class SessionRepository {
  isLoggedIn$ = sessionStore.pipe(select((state) => state.session?.accessToken));

  isAdmin$ = userStore.pipe(select((state) => (state.currentUser?.username ?? '').toLowerCase() === 'admin'));

  session$ = sessionStore.pipe(select((state) => state.session));

  user$ = userStore.pipe(select((state) => state.currentUser));

  isLoggedIn(): boolean {
    return Boolean(sessionStore.getValue().session?.accessToken);
  }

  session(): Session | undefined {
    return sessionStore.getValue().session;
  }

  currentUser(): User | undefined {
    return userStore.getValue().currentUser;
  }

  update(session: Partial<SessionState>) {
    sessionStore.update((state) => ({ ...state, ...session }));
  }

  updateUser(user: Partial<UserState>) {
    userStore.update((state) => ({ ...state, ...user }));
  }
}
