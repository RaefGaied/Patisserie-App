import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ArticleService } from '../../services/article.service';
import { of } from 'rxjs';
import { Article } from '../../models/article.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let articleService: jasmine.SpyObj<ArticleService>;

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
    const articleServiceSpy = jasmine.createSpyObj('ArticleService', ['getArticles']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ArticleService, useValue: articleServiceSpy }
      ]
    }).compileComponents();

    articleService = TestBed.inject(ArticleService) as jasmine.SpyObj<ArticleService>;
    articleService.getArticles.and.returnValue(of(mockArticles));

    fixture = TestBed.createComponent(HomeComponent);
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
}); 