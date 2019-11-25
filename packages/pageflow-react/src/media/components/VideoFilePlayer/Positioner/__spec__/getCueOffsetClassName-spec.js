import getCueOffsetClassName from '../getCueOffsetClassName';


describe('getCueOffsetClassName', () => {
  test('returns css class for offset', () => {
    const videoDimensions = {height: 130, top: -10};
    const wrapperDimensions = {height: 100};

    const result = getCueOffsetClassName(videoDimensions, wrapperDimensions);

    expect(result).toEqual(expect.arrayContaining(['cue_offset ']));
    expect(result).toEqual(expect.arrayContaining(['cue_offset_2']));
  });

  test('returns css class for margins', () => {
    const videoDimensions = {width: 130, left: -10};
    const wrapperDimensions = {width: 100};

    const result = getCueOffsetClassName(videoDimensions, wrapperDimensions);

    expect(result).toEqual(expect.arrayContaining(['cue_margin_left_1']));
    expect(result).toEqual(expect.arrayContaining(['cue_margin_right_2']));
  });
});
