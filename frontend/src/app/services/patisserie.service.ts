import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatisserieService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

 
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles`);
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${id}`);
  }

  
  createArticle(article: FormData): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles`, article);
  }

  updateArticle(id: number, article: FormData): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/articles/${id}`, article);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
