import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Article } from '../models/article.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = `${environment.apiUrl}/articles`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

 
  getArticles(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: this.getHeaders() })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  createArticle(article: FormData): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article, { headers: this.getHeaders() })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  updateArticle(id: string, article: FormData): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, article, { headers: this.getHeaders() })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.';
    } else if (error.status === 500) {
      errorMessage = `Erreur serveur (500): Une erreur s'est produite lors du traitement de votre demande. Si le problème persiste, contactez l'administrateur.`;
      console.error('Détails de l\'erreur serveur:', error.error);
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = `Erreur ${error.status}: ${error.error?.message || 'Requête invalide'}`;
    }

    console.error('Erreur détaillée:', error);
    return throwError(() => new Error(errorMessage));
}
}