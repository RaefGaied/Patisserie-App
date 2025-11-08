import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleManagementComponent } from './article-management.component';
import { ArticleService } from '../../../services/article.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Article } from '../../../models/article.model';

describe('ArticleManagementComponent', () => {
  let component: ArticleManagementComponent;
  let fixture: ComponentFixture<ArticleManagementComponent>;
  let articleService: jasmine.SpyObj<ArticleService>;
  let router: jasmine.SpyObj<Router>;

  const mockArticles: Article[] = [
    {
      _id: '1',
      name: 'Croissant',
      description: 'Un délicieux croissant',
      price: 1.20,
      category: 'Viennoiserie',
      imageUrl: 'assets/images/croissant.jpg'
    },
    {
      _id: '2',
      name: 'Pain au chocolat',
      description: 'Un délicieux pain au chocolat',
      price: 1.40,
      category: 'Viennoiserie',
      imageUrl: 'assets/images/pain-chocolat.jpg'
    }
  ];

  beforeEach(async () => {
    const articleServiceSpy = jasmine.createSpyObj('ArticleService', ['getArticles', 'deleteArticle']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ArticleManagementComponent],
      providers: [
        { provide: ArticleService, useValue: articleServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    articleService = TestBed.inject(ArticleService) as jasmine.SpyObj<ArticleService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    articleService.getArticles.and.returnValue(of(mockArticles));
    articleService.deleteArticle.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(ArticleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles on initialization', () => {
    expect(articleService.getArticles).toHaveBeenCalled();
    expect(component.articles).toEqual(mockArticles);
  });

  it('should display articles in the template', () => {
    const compiled = fixture.nativeElement;
    const articleElements = compiled.querySelectorAll('.card');
    expect(articleElements.length).toBe(mockArticles.length);

    mockArticles.forEach((article, index) => {
      const element = articleElements[index];
      expect(element.querySelector('.card-title').textContent).toContain(article.name);
      expect(element.querySelector('.card-text').textContent).toContain(article.description);
      expect(element.querySelector('.price').textContent).toContain(article.price.toString());
    });
  });

  it('should call deleteArticle and refresh list when deleting an article', () => {
    const articleId = '1';
    component.deleteArticle(articleId);

    expect(articleService.deleteArticle).toHaveBeenCalledWith(articleId);
    expect(articleService.getArticles).toHaveBeenCalledTimes(2); // Once in ngOnInit, once after delete
  });

  it('should handle error when deleting article', () => {
    const error = new Error('Delete failed');
    articleService.deleteArticle.and.returnValue(throwError(() => error));

    component.deleteArticle('1');

    expect(articleService.deleteArticle).toHaveBeenCalledWith('1');
    expect(articleService.getArticles).toHaveBeenCalledTimes(1); // Only in ngOnInit
  });

  it('should navigate to edit page when clicking edit button', () => {
    const articleId = '1';
    component.editArticle(articleId);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/articles/edit', articleId]);
  });
}); 