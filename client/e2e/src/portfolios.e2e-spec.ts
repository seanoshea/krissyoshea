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

describe('Portfolios Page', () => {
  const selector = 'img.homePageImage';

  beforeEach(async () => {
    await browser.get(browser.baseUrl);
  });

  it('should should show a list of images for the portfolio', async () => {
    const homePageImageElement = await element(by.css(selector));
    await homePageImageElement.isDisplayed();

    await homePageImageElement.click();

    const portfolioPhotosList = element.all(by.css('ul.portfolioPhotos'));
    const portfolioPhotos = element.all(by.css('ul.portfolioPhotos li'));

    expect(portfolioPhotosList.count()).toEqual(1);
    expect(portfolioPhotos.count()).toBeGreaterThan(0);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
