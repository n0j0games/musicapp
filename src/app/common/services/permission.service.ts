import {Injectable, signal} from '@angular/core';
import { Subject, Observable, take } from 'rxjs';

export interface Credentials {
  mail: string;
  password: string;
}

export interface CredentialResponse {
  accessToken: string
}

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private openRequest$ = new Subject<void>();
  private result$ = new Subject<Credentials | null>();

  public accessToken = signal<string | null>(null);

  /** Called by the component to know when to open itself */
  onOpenRequested(): Observable<void> {
    return this.openRequest$.asObservable();
  }

  /** Called by the guard: triggers the dialog and waits for a result */
  open(): Observable<Credentials | null> {
    this.openRequest$.next();
    return this.result$.asObservable().pipe(take(1));
  }

  /** Called by the component on submit */
  resolve(credentials: Credentials): void {
    this.result$.next(credentials);
  }

  /** Called by the component on cancel */
  cancelled(): void {
    this.result$.next(null);
  }
}