import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    authService.isAdmin.and.returnValue(true);

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check admin status on initialization', () => {
    expect(authService.isAdmin).toHaveBeenCalled();
  });

  it('should redirect to home if user is not admin', () => {
    authService.isAdmin.and.returnValue(false);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle logout', () => {
    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display admin menu items', () => {
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('.nav-link');
    expect(menuItems.length).toBeGreaterThan(0);
    expect(menuItems[0].textContent).toContain('Articles');
    expect(menuItems[1].textContent).toContain('Déconnexion');
  });
}); 