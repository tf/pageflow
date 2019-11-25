import getDimensions from '../getDimensions';


describe('getDimensions', () => {
  describe('in contain fit', () => {
    test('returns undefined if fit is contain', () => {
      const videoFile = {width: 200, height: 100};
      const fit = 'contain';
      const position = [];
      const wrapperDimensions = {width: 200, height: 100};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result).toBeUndefined();
    });
  });

  describe('in cover fit', () => {
    test('scales video to fit width of wide wrapper', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'cover';
      const position = [];
      const wrapperDimensions = {width: 400, height: 100};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result.left).toBe(0);
      expect(result.top).toBe(-50);
      expect(result.width).toBe(400);
      expect(result.height).toBe(200);
    });

    test('scales video to fit height of narrow wrapper', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'cover';
      const position = [];
      const wrapperDimensions = {width: 100, height: 200};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result.left).toBe(-150);
      expect(result.top).toBe(0);
      expect(result.width).toBe(400);
      expect(result.height).toBe(200);
    });

    test('applies x position if video is scaled to match height', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'cover';
      const position = [100, 0];
      const wrapperDimensions = {width: 100, height: 200};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result.left).toBe(-300);
      expect(result.top).toBe(0);
      expect(result.width).toBe(400);
      expect(result.height).toBe(200);
    });

    test('applies y position if video is scaled to match width', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'cover';
      const position = [100, 0];
      const wrapperDimensions = {width: 400, height: 100};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result.left).toBe(0);
      expect(result.top).toBe(0);
      expect(result.width).toBe(400);
      expect(result.height).toBe(200);
    });
  });

  describe('in smart_contain fit', () => {
    test('scales video to fit width of wrapper that is a bit too wide', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'smart_contain';
      const position = [];
      const wrapperDimensions = {width: 210, height: 100};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result.left).toBe(0);
      expect(result.top).toBe(-2.5);
      expect(result.width).toBe(210);
      expect(result.height).toBe(105);
    });

    test('ignores position', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'smart_contain';
      const position = [100, 100];
      const wrapperDimensions = {width: 210, height: 100};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result.left).toBe(0);
      expect(result.top).toBe(-2.5);
      expect(result.width).toBe(210);
      expect(result.height).toBe(105);
    });

    test('scales video to fit height of wrapper that is a bit too narrow', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'smart_contain';
      const position = [];
      const wrapperDimensions = {width: 190, height: 100};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result.left).toBe(-5);
      expect(result.top).toBe(0);
      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });

    test('returns undefined if wrapper is too narrow', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'smart_contain';
      const position = [];
      const wrapperDimensions = {width: 200, height: 200};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result).toBeUndefined();
    });

    test('returns undefined if wrapper is too wide', () => {
      const videoFile = {width: 20, height: 10};
      const fit = 'smart_contain';
      const position = [];
      const wrapperDimensions = {width: 400, height: 100};

      const result = getDimensions(videoFile, fit, position, wrapperDimensions);

      expect(result).toBeUndefined();
    });
  });
});
