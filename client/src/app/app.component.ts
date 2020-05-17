import { Component, OnInit } from '@angular/core';
import { PortfoliosService } from './portfolios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'Krissy O\'Shea';

  constructor(private service: PortfoliosService) { }

  ngOnInit(): void {
    this.service.fetch().subscribe();
  }
}
