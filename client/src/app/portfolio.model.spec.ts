import { Portfolio } from './portfolio.model';

describe('Portfolio', () => {
  it('should create an instance', () => {
    expect(new Portfolio('id', 'owner', 'username', 'primary',
            'count_photos', 'count_videos', 'title', 'visibility_can_see_set')).toBeTruthy();
  });
});
