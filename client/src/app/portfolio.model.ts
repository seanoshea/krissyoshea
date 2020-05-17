export class Portfolio {
    constructor(
        public id: string, private owner: string,
        private username: string, private primary: string,
        private count_photos: string, private count_videos: string,
        private title: string, private visibility_can_see_set: string) { }
}
