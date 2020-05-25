/*
Copyright 2016 - present Sean O'Shea

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
      portfolio = PortfoliosService.parsePortfolios(portfolioJSON)[0];
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
