import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleFormComponent } from './article-form.component';
import { ArticleService } from '../../../services/article.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Article } from '../../../models/article.model';

describe('ArticleFormComponent', () => {
  let component: ArticleFormComponent;
  let fixture: ComponentFixture<ArticleFormComponent>;
  let articleService: jasmine.SpyObj<ArticleService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockArticle: Article = {
    _id: '1',
    name: 'Croissant',
    description: 'Un délicieux croissant',
    price: 1.20,
    category: 'Viennoiserie',
    imageUrl: 'assets/images/croissant.jpg'
  };

  beforeEach(async () => {
    const articleServiceSpy = jasmine.createSpyObj('ArticleService', ['getArticle', 'createArticle', 'updateArticle']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteStub = {
      snapshot: {
        params: {},
        data: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [ArticleFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ArticleService, useValue: articleServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    articleService = TestBed.inject(ArticleService) as jasmine.SpyObj<ArticleService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(ArticleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values in create mode', () => {
    expect(component.articleForm.get('name')?.value).toBe('');
    expect(component.articleForm.get('description')?.value).toBe('');
    expect(component.articleForm.get('price')?.value).toBe('');
    expect(component.articleForm.get('category')?.value).toBe('');
  });

  it('should load article data in edit mode', () => {
    activatedRoute.snapshot.params['id'] = '1';
    articleService.getArticle.and.returnValue(of(mockArticle));

    component.ngOnInit();

    expect(articleService.getArticle).toHaveBeenCalledWith('1');
    expect(component.articleForm.get('name')?.value).toBe(mockArticle.name);
    expect(component.articleForm.get('description')?.value).toBe(mockArticle.description);
    expect(component.articleForm.get('price')?.value).toBe(mockArticle.price);
    expect(component.articleForm.get('category')?.value).toBe(mockArticle.category);
  });

  it('should call createArticle when submitting new article', () => {
    const formData = new FormData();
    articleService.createArticle.and.returnValue(of(mockArticle));

    component.articleForm.patchValue({
      name: 'New Article',
      description: 'Description',
      price: 10,
      category: 'Category'
    });

    component.onSubmit();

    expect(articleService.createArticle).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/articles']);
  });

  it('should call updateArticle when submitting existing article', () => {
    activatedRoute.snapshot.params['id'] = '1';
    articleService.getArticle.and.returnValue(of(mockArticle));
    articleService.updateArticle.and.returnValue(of(mockArticle));

    component.ngOnInit();
    component.onSubmit();

    expect(articleService.updateArticle).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/articles']);
  });

  it('should handle error when submitting form', () => {
    const error = new Error('Submit failed');
    articleService.createArticle.and.returnValue(throwError(() => error));

    component.articleForm.patchValue({
      name: 'New Article',
      description: 'Description',
      price: 10,
      category: 'Category'
    });

    component.onSubmit();

    expect(component.error).toBe('Erreur lors de la sauvegarde de l\'article');
  });

  it('should handle file selection', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = {
      target: {
        files: [file]
      }
    };

    component.onFileChange(event as any);

    expect(component.articleForm.get('image')?.value).toBe(file);
  });
}); 