import { Component, OnInit } from '@angular/core';

import { PortfoliosService } from '../portfolios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private service: PortfoliosService) { }

  loading = true;
  randomizedPortfolio;
  randomizedPhoto;

  ngOnInit() {
    this.service.observablePortfolios.subscribe(() => {
      this.portfoliosLoaded();
    });
  }

  portfoliosLoaded() {
    const first = this.randomizeFirstPortfolio();
    if (first) {
      // ok, good - at least we have a definite portfolio to show
      // now - I wonder if we have these photos already
      if (this.service.hasLoadedPhotosForPortfolio(first)) {
        // great - we've already been here - lets show them
        const photos = this.service.photos[first.id];
        this.photosLoaded(photos);
      } else {
        // best to load them and show them then
        this.service.fetchPhotos(first.id).subscribe(photos => {
          this.photosLoaded(photos);
        });
      }
    }
  }

  photosLoaded(photos) {
    this.loading = false;
    this.randomizedPhoto = photos[0];
  }

  randomizeFirstPortfolio() {
    const index = Math.floor(Math.random() * this.service.portfolios.length - 1);
    this.randomizedPortfolio = this.service.portfolios[index];
    return this.randomizedPortfolio;
  }

  mainScreenImagePressed() {
    this.service.selectedPortfolio = this.randomizedPortfolio;
    this.router.navigate(['/portfolio']);
  }
}
