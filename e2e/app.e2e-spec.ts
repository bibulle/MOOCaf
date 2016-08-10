import { MOOCafPage } from './app.po';

describe('moocaf App', function() {
  let page: MOOCafPage;

  beforeEach(() => {
    page = new MOOCafPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
