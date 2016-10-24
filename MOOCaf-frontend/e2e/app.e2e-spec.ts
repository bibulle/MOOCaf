import { MOOCafFrontendPage } from './app.po';

describe('moocaf-frontend App', function() {
  let page: MOOCafFrontendPage;

  beforeEach(() => {
    page = new MOOCafFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
