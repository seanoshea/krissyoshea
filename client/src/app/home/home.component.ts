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
