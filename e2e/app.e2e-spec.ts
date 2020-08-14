import { PortalPage } from './app.po';

describe('portal App', () => {
  let page: PortalPage;

  beforeEach(() => {
    page = new PortalPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
