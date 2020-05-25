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

import { Component, AfterContentChecked } from '@angular/core';
import { PortfoliosService } from '../portfolios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements AfterContentChecked {
  photos: any;

  constructor(private router: Router, private service: PortfoliosService) { }

  ngAfterContentChecked(): void {
    // ensure that we have at least a portfolio
    if (!this.service.selectedPortfolio) {
      this.router.navigate(['/']);
    } else {
      // ok - we have one. I wonder if we already have the photos for this?
      if (this.service.hasLoadedPhotosForPortfolio(this.service.selectedPortfolio)) {
        this.photosLoaded();
      } else {
        // better find the photos and display them
        this.service.fetchPhotos(this.service.selectedPortfolio.id).subscribe(() => {
          this.photosLoaded();
        });
      }
    }
  }

  photosLoaded(): void {
    if (this.service.photos[this.service.selectedPortfolio.id]) {
      this.photos = this.service.photos[this.service.selectedPortfolio.id].map((photo) => {
        return photo.url_m;
      });
    }
  }
}
