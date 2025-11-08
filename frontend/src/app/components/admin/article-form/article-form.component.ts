import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent implements OnInit {
  articleForm: FormGroup;
  error: string | null = null;
  isEditMode = false;
  articleId: string | null = null;
  previewUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.articleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.isEditMode = true;
      this.loadArticle(this.articleId);
    }
  }

  loadArticle(id: string): void {
    this.articleService.getArticle(id).subscribe({
      next: (article) => {
        this.articleForm.patchValue({
          name: article.name,
          description: article.description,
          price: article.price,
          category: article.category
        });
        this.previewUrl = article.imageUrl || null;
      },
      error: (err) => {
        this.error = 'Article introuvable.';
        this.router.navigate(['/admin/articles']);
      }
    });
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      const formData = new FormData();
      formData.append('name', this.articleForm.get('name')?.value);
      formData.append('description', this.articleForm.get('description')?.value);
      formData.append('price', this.articleForm.get('price')?.value.toString());
      formData.append('category', this.articleForm.get('category')?.value);

      const imageFile = this.articleForm.get('image')?.value;
      if (imageFile instanceof File) {
        formData.append('image', imageFile);
      }

      if (this.isEditMode && this.articleId) {
        this.articleService.updateArticle(this.articleId, formData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Article modifié avec succès!',
              showConfirmButton: false,
              timer: 2000
            });
            this.router.navigate(['/admin/articles']);
          },
          error: (err) => {
            this.error = 'Erreur lors de la mise à jour de l\'article';
            Swal.fire({
              icon: 'error',
              title: 'Erreur!',
              text: 'La modification a échoué.'
            });
          }
        });
      } else {
        this.articleService.createArticle(formData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Article créé avec succès!',
              showConfirmButton: false,
              timer: 2000
            });
            this.router.navigate(['/admin/articles']);
          },
          error: (err) => {
            this.error = 'Erreur lors de la création de l\'article';
            Swal.fire({
              icon: 'error',
              title: 'Erreur!',
              text: 'La création a échoué.'
            });
          }
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide!',
        text: 'Veuillez corriger les erreurs avant de soumettre.'
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.articleForm.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
