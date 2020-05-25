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

import { browser, logging, element, by } from 'protractor';

describe('Home Page', () => {
  const selector = 'img.homePageImage';

  beforeEach(async () => {
    await browser.get(browser.baseUrl);
  });

  it('should display four primary navigation links', () => {
    const primaryNavigationElements = element.all(by.css('ul.primaryNavigation li'));

    expect(primaryNavigationElements.count()).toEqual(4);
  });

  it('should create secondary navigation links too', async () => {
    // need to get the links to render first
    await element(by.id('portfolioLink')).click();
    await element(by.css('ul.secondaryNavigation'));

    const secondaryNavigationElements = element.all(by.css('ul.secondaryNavigation li'));
    // cant really give an absolute value here as this is dynamic
    expect(secondaryNavigationElements.count()).toBeGreaterThan(0);
  });

  it('should display a home image', async () => {
    await element(by.css(selector));
  });

  it('should navigate to the portfolios page when the user clicks on the home image', async () => {
    const homePageImageElement = await element(by.css(selector));
    await homePageImageElement.isDisplayed();

    await homePageImageElement.click();

    expect(browser.getCurrentUrl()).toContain('/portfolio');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
