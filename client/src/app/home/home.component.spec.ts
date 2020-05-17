import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { HomeComponent } from './home.component';
import { PortfoliosService } from '../portfolios.service';
import { TestPortfoliosService } from '../../testing/test-portfolio-service';
import { mockedPhoto } from '../../testing/test-utils';
const photosJSON: any = require('../../testing/mocked_responses/photos.json');
const portfolioJSON: any = require('../../testing/mocked_responses/portfolios.json');

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let service: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ HomeComponent ],
      providers: [{
        provide: PortfoliosService, useClass: TestPortfoliosService,
      }],
    })
    .compileComponents();
    router = TestBed.inject(Router);
    service = TestBed.inject(PortfoliosService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Portfolios Loaded', () => {
    beforeEach(() => {
      const portfolios = service.parsePortfolios(portfolioJSON);
      service.selectedPortfolio = portfolios[0];
    });
    describe('Photos for this portfolio already loaded', () => {
      it('should not have to load photos for this portfolio again', () => {
        service.photos = {};
        service.photos[service.selectedPortfolio.id] = [mockedPhoto(photosJSON)];
        const randomizedSpy = spyOn(component, 'randomizeFirstPortfolio').and.returnValue(service.selectedPortfolio);
        const hasLoadedSpy = spyOn(service, 'hasLoadedPhotosForPortfolio').and.returnValue(true);
        const apiSpy = spyOn(service, 'fetchPhotos');

        component.portfoliosLoaded();

        expect(component.loading).toBeFalse();

        expect(randomizedSpy).toHaveBeenCalled();
        expect(hasLoadedSpy).toHaveBeenCalled();
        expect(apiSpy).not.toHaveBeenCalled();
      });
    });
    describe('Photos not loaded for this portfolio', () => {
      it('should make an API call to get the photos for a portfolio', () => {
        const randomizedSpy = spyOn(component, 'randomizeFirstPortfolio').and.returnValue(service.selectedPortfolio);
        const hasLoadedSpy = spyOn(service, 'hasLoadedPhotosForPortfolio').and.returnValue(false);

        const apiSpy = spyOn(service, 'fetchPhotos').and.callThrough();

        component.ngOnInit();

        expect(randomizedSpy).toHaveBeenCalled();
        expect(hasLoadedSpy).toHaveBeenCalledWith(service.selectedPortfolio);
        expect(apiSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Pressing on the main screen image', () => {
    it('should send you over to the portfolio screen', () => {
      const navigateSpy = spyOn(router, 'navigate');

      component.mainScreenImagePressed();

      expect(navigateSpy).toHaveBeenCalledWith(['/portfolio']);
    });
  });

  describe('When the photos from the randomized photo have loaded', () => {
    it('should set the randomizedPhoto property on the component', () => {
      expect(component.loading).toBeTrue();

      component.photosLoaded([mockedPhoto(photosJSON)]);

      expect(component.randomizedPhoto).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });
});
