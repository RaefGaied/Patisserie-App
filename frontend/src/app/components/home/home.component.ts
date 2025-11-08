import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  articles: Article[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 6;
  error: string | null = null;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(page: number = 1): void {
    this.articleService.getArticles(page, this.itemsPerPage).subscribe(
      (response) => {
        console.log('Réponse API articles:', response); 
        this.articles = response.articles;
        this.totalPages = response.totalPages;
        this.currentPage = page;
      },
      (error) => {
        console.error('Erreur chargement articles:', error);
        this.error = 'Erreur lors du chargement des articles';
      }
    );
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadArticles(page);
    }
  }

  onItemsPerPageChange(): void {
    this.loadArticles(1);
  }

  addToCart(article: Article): void {
    console.log('Adding to cart:', article);
  }
}
