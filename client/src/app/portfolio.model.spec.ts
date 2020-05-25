/*
Copyright 2016 - present Sean O'Shea

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Portfolio } from './portfolio.model';

describe('Portfolio', () => {
  it('should create an instance', () => {
    expect(new Portfolio('id', 'owner', 'username', 'primary',
            'count_photos', 'count_videos', 'title', 'visibility_can_see_set')).toBeTruthy();
  });
});
