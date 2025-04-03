import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logoutActivateGuardGuard } from './logout-activate-guard.guard';

describe('logoutActivateGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logoutActivateGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
