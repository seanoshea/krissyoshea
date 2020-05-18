import { Component, OnInit } from '@angular/core';
import { PortfoliosService } from '../portfolios.service';
import { Portfolio } from '../portfolio.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less']
})
export class NavigationComponent implements OnInit {
  loading = true;
  showSubnavigation = false;
  constructor(public service: PortfoliosService, private router: Router) { }

  ngOnInit(): void {
    this.service.observablePortfolios.subscribe(() => {
      this.loading = false;
    });
  }

  portfolioLinkPressed(): void {
    if (!this.loading) {
      this.showSubnavigation = !this.showSubnavigation;
    }
  }

  portfolioPressed(portfolio: Portfolio): void {
    console.warn('portfolioPressed');
    this.service.selectedPortfolio = portfolio;
    this.router.navigate(['/portfolio']);
  }
}
