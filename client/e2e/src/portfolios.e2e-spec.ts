import { browser, logging, element, by } from 'protractor';

describe('Portfolios Page', () => {
  let selector = 'img.homePageImage';

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
