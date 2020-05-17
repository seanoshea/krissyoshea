import { Photo } from './photo.model';

describe('Photo', () => {
  it('should create an instance', () => {
    expect(new Photo('id', 'title', 'ispublic', 'url_m', 'height_m', 'width_m', 'url_o', 'height_o', 'width_o')).toBeTruthy();
  });
});
