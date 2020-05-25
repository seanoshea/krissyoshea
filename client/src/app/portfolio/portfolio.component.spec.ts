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

import { PortfolioComponent } from './portfolio.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PortfoliosService } from '../portfolios.service';
import { TestPortfoliosService } from 'src/testing/test-portfolio-service';
import { Router } from '@angular/router';
import { mockedPhoto } from '../../testing/test-utils';
const portfolioJSON: any = require('../../testing/mocked_responses/portfolios.json');
const photosJSON: any = require('../../testing/mocked_responses/photos.json');

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let router: Router;
  let service: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ PortfolioComponent ],
      providers: [{
        provide: PortfoliosService, useClass: TestPortfoliosService,
      }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioComponent);
    router = TestBed.inject(Router);
    service = TestBed.inject(PortfoliosService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('No Portfolio is selected', () => {
    it('should send you back to the home page', () => {
      const navigateSpy = spyOn(router, 'navigate');

      component.ngAfterContentChecked();

      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });
  });

  describe('A portfolio is selected', () => {
    beforeEach(() => {
      const portfolios = PortfoliosService.parsePortfolios(portfolioJSON);
      service.selectedPortfolio = portfolios[0];
      service.photos = [];
      service.photos[service.selectedPortfolio] = [mockedPhoto(photosJSON)];
    });
    describe('Has loaded photos for this portfolio', () => {
      it('should not make an api call for retrieving the photos', () => {
        const hasLoadedSpy = spyOn(service, 'hasLoadedPhotosForPortfolio').and.returnValue(true);
        const apiSpy = spyOn(service, 'fetchPhotos');

        component.ngAfterContentChecked();

        expect(hasLoadedSpy).toHaveBeenCalledWith(service.selectedPortfolio);
        expect(apiSpy).not.toHaveBeenCalled();
      });
    });
    describe('Has not loaded photos for this portfolio', () => {
      it('should make an api call for retrieving the photos', () => {
        const hasLoadedSpy = spyOn(service, 'hasLoadedPhotosForPortfolio').and.returnValue(false);
        const apiSpy = spyOn(service, 'fetchPhotos').and.callThrough();

        component.ngAfterContentChecked();

        expect(hasLoadedSpy).toHaveBeenCalledWith(service.selectedPortfolio);
        expect(apiSpy).toHaveBeenCalled();
      });
    });
  });
});
