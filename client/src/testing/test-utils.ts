import { Photo } from 'src/app/photo.model';

export function mockedPhoto(json) {
  const photos = json.photoset.photo.map(photo => {
    return new Photo(
      photo.id,
      photo.title,
      photo.ispublic,
      photo.url_m,
      photo.height_m,
      photo.width_m,
      photo.url_o,
      photo.height_o,
      photo.width_o
    );
  });
  return photos[0];
}
