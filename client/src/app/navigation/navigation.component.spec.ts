import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { PortfoliosService } from '../portfolios.service';
import { MockedPortfoliosService } from '../../testing/test-portfolio-service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
const portfolioJSON: any = require('../../testing/mocked_responses/portfolios.json');

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let router: Router;
  let service: PortfoliosService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ NavigationComponent ],
      providers: [{
        provide: PortfoliosService, useClass: MockedPortfoliosService,
      }],
    })
    .compileComponents();
    router = TestBed.inject(Router);
    service = TestBed.inject(PortfoliosService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should hide the secondary navigation by default', () => {
      expect(fixture.debugElement.query(By.css('.secondaryNavigation'))).toBeNull();
    });
  });

  describe('Interactions with the portfolio navigation item', () => {
    describe('portfolios have not loaded', () => {
      it('should not open the secondary navigation', () => {
        component.loading = true;

        component.portfolioLinkPressed();

        expect(component.showSubnavigation).toBeFalse();
      });
    });
    describe('portfolios have loaded', () => {
      beforeEach(() => {
        component.loading = false;
      });
      describe('secondary navigation is not already open', () => {
        it('should open the secondary navigation item', () => {
          component.showSubnavigation = false;

          component.portfolioLinkPressed();

          expect(component.showSubnavigation).toBeTrue();
        });
      });
      describe('secondary navigation is already open', () => {
        it('should close the secondary navigation item', () => {
          component.showSubnavigation = true;

          component.portfolioLinkPressed();

          expect(component.showSubnavigation).toBeFalse();
        });
      });
    });
  });

  describe('Pressing on one of the secondary navigation items', () => {
    let portfolio;
    beforeAll(() => {
      portfolio = service.parsePortfolios(portfolioJSON)[0];
    });
    it('should send you over to the portfolio screen', () => {
      const navigateSpy = spyOn(router, 'navigate');

      component.portfolioPressed(portfolio);

      expect(navigateSpy).toHaveBeenCalledWith(['/portfolio']);
      expect(service.selectedPortfolio).toBeDefined();
    });
    it('should close out on the sub navigation', () => {
      const navigateSpy = spyOn(router, 'navigate');

      component.portfolioPressed(portfolio);

      expect(navigateSpy).toHaveBeenCalledWith(['/portfolio']);
      expect(component.showSubnavigation).toBeFalse();
    });
  });
});
