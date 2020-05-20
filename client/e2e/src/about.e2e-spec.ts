import { browser, logging, element, by } from 'protractor';

describe('About Page', () => {

  beforeEach(async () => {
    await browser.get(`${browser.baseUrl}/about`);
  });

  it('should include about information', () => {
    const aboutParagraph = element.all(by.css('p.content'));

    expect(aboutParagraph.count()).toEqual(1);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
