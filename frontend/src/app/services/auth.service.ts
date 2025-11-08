import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthUser {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface LoginResponse extends AuthUser {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser$: Observable<AuthUser | null>;

  constructor(private http: HttpClient) {
    let user: AuthUser | null = null;

    try {
      if (this.isLocalStorageAvailable()) {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem(this.tokenKey);

        if (storedUser && storedUser !== 'undefined') {
          user = JSON.parse(storedUser);
        } else if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          user = {
            _id: payload.id || payload._id, 
            username: payload.username,
            email: payload.email,
            role: payload.role
          };
        }
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
      user = null;
    }

    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          localStorage.setItem(this.tokenKey, response.token);
          const userToStore = {
            _id: response._id,
            username: response.username,
            email: response.email,
            role: response.role
          };
          localStorage.setItem('currentUser', JSON.stringify(userToStore));
          this.currentUserSubject.next(userToStore);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, { username, email, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          const userToStore = {
            _id: response._id,
            username: response.username,
            email: response.email,
            role: response.role
          };
          localStorage.setItem('currentUser', JSON.stringify(userToStore));
          this.currentUserSubject.next(userToStore);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
