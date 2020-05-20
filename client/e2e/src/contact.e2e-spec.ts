import { browser, logging, element, by } from 'protractor';

describe('Contact Page', () => {

  beforeEach(async () => {
    await browser.get(`${browser.baseUrl}/contact`);
  });

  it('should include contact information', () => {
    const contactClientList = element.all(by.css('ul.clientList'));

    expect(contactClientList.count()).toEqual(1);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
