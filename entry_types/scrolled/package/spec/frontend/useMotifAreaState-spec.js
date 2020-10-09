import {useMotifAreaState} from 'frontend/useMotifAreaState';

import {renderHook, act} from '@testing-library/react-hooks';
import {createElementWithDimension} from 'support/createElementWithDimension';

describe('useMotifAreaState', () => {
  describe('isIntersectingX', () => {
    it('is true if content area overlaps motif area horizontally', () => {
      const {result} = renderHook(() => useMotifAreaState());

      const motifAreaEl = createElementWithDimension({viewportLeft: 200, width: 500});
      const contentAreaEl = createElementWithDimension({viewportLeft: 100, width: 300});

      const [, setMotifAreaRect, setContentAreaRef] = result.current;

      act(() => {
        setMotifAreaRect(motifAreaEl);
        setContentAreaRef(contentAreaEl);
      });

      const [{isIntersectingX}] = result.current;
      expect(isIntersectingX).toEqual(true);
    });

    it('is false if content area does not overlap motif area horizontally', () => {
      const {result} = renderHook(() => useMotifAreaState());

      const motifAreaEl = createElementWithDimension({viewportLeft: 500, width: 500});
      const contentAreaEl = createElementWithDimension({viewportLeft: 100, width: 300});

      const [, setMotifAreaRect, setContentAreaRef] = result.current;

      act(() => {
        setMotifAreaRect(motifAreaEl);
        setContentAreaRef(contentAreaEl);
      });

      const [{isIntersectingX}] = result.current;
      expect(isIntersectingX).toEqual(false);
    });
  });

  describe('intersectionRatioY', () => {
    it('returns ratio of motif area that is intersected by content area', () => {
      const {result} = renderHook(() => useMotifAreaState());

      const motifAreaEl = createElementWithDimension({
        viewportLeft: 200, viewportTop: 100, width: 500, height: 400
      });
      const contentAreaEl = createElementWithDimension({
        viewportLeft: 100, viewportTop: 400, width: 300
      });

      const [, setMotifAreaRect, setContentAreaRef] = result.current;

      act(() => {
        setMotifAreaRect(motifAreaEl);
        setContentAreaRef(contentAreaEl);
      });

      const [{intersectionRatioY}] = result.current;
      expect(intersectionRatioY).toEqual(0.25);
    });
  });

  describe('padding', () => {
    it('returns distance that content needs to be shifted down to prevent', () => {
      const {result} = renderHook(() => useMotifAreaState());

      const motifAreaEl = createElementWithDimension({
        viewportLeft: 200, viewportTop: 100, width: 500, height: 400
      });
      const contentAreaEl = createElementWithDimension({
        viewportLeft: 100, viewportTop: 400, width: 300
      });

      const [, setMotifAreaRect, setContentAreaRef] = result.current;

      act(() => {
        setMotifAreaRect(motifAreaEl);
        setContentAreaRef(contentAreaEl);
      });

      const [{intersectionRatioY}] = result.current;
      expect(intersectionRatioY).toEqual(0.25);
    });
  });
});
