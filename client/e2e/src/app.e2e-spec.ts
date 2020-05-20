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

    expect(browser.getCurrentUrl()).toContain("/portfolio");
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
