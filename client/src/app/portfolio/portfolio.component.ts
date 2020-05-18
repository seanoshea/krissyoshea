import { Component, OnInit } from '@angular/core';
import { PortfoliosService } from '../portfolios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent {
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
