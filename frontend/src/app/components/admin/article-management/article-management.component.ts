import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { Article } from '../../../models/article.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-article-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './article-management.component.html',
  styleUrls: ['./article-management.component.css']
})
export class ArticleManagementComponent implements OnInit {
  articles: Article[] = [];
  error: string | null = null;
  currentPage = 1;
  totalPages = 0;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(page: number = 1): void {
  this.articleService.getArticles(page).subscribe({
    next: (response) => {
      this.articles = response.articles;
      this.totalPages = response.totalPages; 
      this.currentPage = page;
    },
    error: (err) => {
      this.error = 'Erreur lors du chargement des articles';
      console.error('Error loading articles:', err);
    }
  });
}


  deleteArticle(id: string): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Voulez-vous vraiment supprimer cet article ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.articleService.deleteArticle(id).subscribe({
          next: () => {
            this.articles = this.articles.filter(article => article._id !== id);
            Swal.fire('Supprimé', 'L’article a été supprimé.', 'success');
          },
          error: (err) => {
            this.error = 'Erreur lors de la suppression';
            console.error('Erreur suppression :', err);
            Swal.fire('Erreur', 'Échec de la suppression.', 'error');
          }
        });
      }
    });
  }

  editArticle(id: string): void {
    this.router.navigate(['/admin/articles', id, 'edit']);
  }

  createArticle(): void {
    this.router.navigate(['/admin/articles/new']);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadArticles(page);
    }
  }
}
