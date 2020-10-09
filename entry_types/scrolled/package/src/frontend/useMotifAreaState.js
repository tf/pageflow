import {useCallback} from 'react';

import isIntersectingX from './isIntersectingX';
import useBoundingClientRect from './useBoundingClientRect';
import useDimension from './useDimension';

export function useMotifAreaState({sectionTransition, fullHeight, empty} = {}) {
  const [motifAreaRect, setMotifAreaRectRef] = useBoundingClientRect();
  const [motifAreaDimension, setMotifAreaDimensionRef] = useDimension();

  const setMotifAreaRef = useCallback(node => {
    setMotifAreaRectRef(node);
    setMotifAreaDimensionRef(node);
  }, [setMotifAreaRectRef, setMotifAreaDimensionRef]);

  const [contentAreaRect, setContentAreaRef] = useBoundingClientRect();
  const intersectingX = isIntersectingX(motifAreaRect, contentAreaRect) && motifAreaRect.height > 0;

  const padding = getMotifAreaPadding(sectionTransition, motifAreaDimension, motifAreaRect);

  return [
    {
      padding: intersectingX && !empty ? padding : 0,
      minHeight: fullHeight ? undefined : getMotifAreaMinHeight(sectionTransition, motifAreaDimension, motifAreaRect),
      intersectionRatioY: empty ? 0 : getIntersectionRatioY(intersectingX, motifAreaRect, contentAreaRect),
      isIntersectingX: intersectingX
    },
    setMotifAreaRef,
    setContentAreaRef,
  ];
}

function getMotifAreaPadding(sectionTransition, motifAreaDimension) {
  return sectionTransition?.startsWith('fade') ?
         motifAreaDimension.top / 3 * 2 + motifAreaDimension.height :
         sectionTransition?.startsWith('scroll') ?
         motifAreaDimension.top + motifAreaDimension.height :
         sectionTransition?.startsWith('reveal') ?
         motifAreaDimension.top + motifAreaDimension.height :
         motifAreaDimension.height;
}

function getMotifAreaMinHeight(sectionTransition, motifAreaDimension) {
  return sectionTransition?.startsWith('scroll') || sectionTransition?.startsWith('fade') ?
         motifAreaDimension.top + motifAreaDimension.height :
         sectionTransition?.startsWith('reveal') ?
         motifAreaDimension.bottom + motifAreaDimension.height :
         motifAreaDimension.height;
}

function getIntersectionRatioY(intersectingX, motifAreaRect, contentAreaRect) {
  const motifAreaOverlap = Math.min(motifAreaRect.height, motifAreaRect.bottom - contentAreaRect.top)
  return intersectingX ? motifAreaOverlap / motifAreaRect.height : 0;
}
