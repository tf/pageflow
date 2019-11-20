import pickAttributes from '../pickAttributes';


describe('loadFromSeed', () => {
  test('camelized attribute', () => {
    const post = {long_title: 'News'};

    const result = pickAttributes(['long_title'], post);

    expect(result).toEqual({longTitle: 'News'});
  });

  test('supports mapping attribute names', () => {
    const post = {post_type: 'gallery'};

    const result = pickAttributes([{type: 'post_type'}], post);

    expect(result).toEqual({type: 'gallery'});
  });

  test('supports including additional attributes', () => {
    const post = {title: 'News'};
    const additional = {some_setting: 'value'};

    const result = pickAttributes(['title'], post, additional);

    expect(result).toEqual({title: 'News', someSetting: 'value'});
  });
});
