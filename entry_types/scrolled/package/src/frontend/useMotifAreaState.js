import {useCallback} from 'react';

import isIntersectingX from './isIntersectingX';
import useBoundingClientRect from './useBoundingClientRect';
import useDimension from './useDimension';

export function useMotifAreaState({sectionTransition, empty} = {}) {
  const [motifAreaRect, setMotifAreaRectRef] = useBoundingClientRect();
  const [motifAreaDimension, setMotifAreaDimensionRef] = useDimension();

  const setMotifAreaRef = useCallback(node => {
    setMotifAreaRectRef(node);
    setMotifAreaDimensionRef(node);
  }, [setMotifAreaRectRef, setMotifAreaDimensionRef]);

  const [contentAreaRect, setContentAreaRef] = useBoundingClientRect();
  const intersectingX = isIntersectingX(motifAreaRect, contentAreaRect) && motifAreaRect.height > 0;

  const padding = getMotifAreaPadding(sectionTransition, motifAreaDimension);

  return [
    {
      padding: intersectingX ? padding : 0,
      minHeight: padding,
      intersectionRatioY: getIntersectionRatioY(intersectingX, motifAreaRect, contentAreaRect),
      isIntersectingX: intersectingX
    },
    setMotifAreaRef,
    setContentAreaRef,
  ];
}

function getMotifAreaPadding(sectionTransition, motifAreaDimension) {
  return sectionTransition?.startsWith('scroll') ?
         motifAreaDimension.top + motifAreaDimension.height :
         motifAreaDimension.top + motifAreaDimension.height;
}

function getIntersectionRatioY(intersectingX, motifAreaRect, contentAreaRect) {
  const motifAreaOverlap = Math.min(motifAreaRect.height, motifAreaRect.bottom - contentAreaRect.top)
  return intersectingX ? motifAreaOverlap / motifAreaRect.height : 0;
}
