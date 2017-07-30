import { GeneticAlgorithmPage } from './app.po';

describe('genetic-algorithm App', () => {
  let page: GeneticAlgorithmPage;

  beforeEach(() => {
    page = new GeneticAlgorithmPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
