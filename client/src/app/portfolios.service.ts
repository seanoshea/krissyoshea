import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { Portfolio } from './portfolio.model';
import { Photo } from './photo.model';

@Injectable({
  providedIn: 'root'
})
export class PortfoliosService {
  portfoliosUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=91622522@N07&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSONP_CALLBACK';
  portfolioPhotosUrl = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&extras=url_m,url_o&photoset_id=${0}&api_key=3426649638b25fe317be122d3fbbc1b1&format=json&jsoncallback=JSONP_CALLBACK';
  public portfolios: Portfolio[] = [];
  public photos: Photo[] = [];
  observablePortfolios: any;
  observablePhotos: any;
  public selectedPortfolio: Portfolio;

  constructor(private http: HttpClient) {
    this.observablePortfolios = new BehaviorSubject<Portfolio[]>(this.portfolios);
    this.observablePhotos = new BehaviorSubject<{}>(this.photos);
  }

  fetch() {
    return this.http.jsonp(this.portfoliosUrl, 'callback').pipe(
      map(res => {
        this.portfolios = PortfoliosService.parsePortfolios(res);
        this.observablePortfolios.next(this.portfolios);
        return this.portfolios;
      })
    );
  }

  fetchPhotos(id: string) {
    const url = this.portfolioPhotosUrl.replace('${0}', id);
    return this.http.jsonp(url, 'callback').pipe(
      map(res => {
        const photos = res['photoset']['photo'].map(photo => {
          return new Photo(
            photo.id,
            photo.title,
            photo.ispublic,
            photo.url_m,
            photo.height_m,
            photo.width_m,
            photo.url_o,
            photo.height_o,
            photo.width_o
          );
        });
        // store this for later
        this.photos[id] = photos;
        this.observablePhotos.next(this.photos);
        return photos;
      })
    );
  }

  hasLoadedPhotosForPortfolio(portfolio) {
    return portfolio && this.photos[portfolio.id];
  }

  static parsePortfolios(json) {
    return json.photosets.photoset.map(photoset => {
      return new Portfolio(
        photoset.id,
        photoset.owner,
        photoset.username,
        photoset.primary,
        photoset.count_photos,
        photoset.count_videos,
        photoset.title._content,
        photoset.visibility_can_see_set
      );
    });
  }
}
