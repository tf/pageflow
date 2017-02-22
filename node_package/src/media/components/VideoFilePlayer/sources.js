import {has} from 'utils';

export default function(videoFile, quality) {
  quality = quality || 'auto';

  const fallbackQuality = has('high bandwidth') ? 'high' : 'medium';

  if (quality == 'auto') {
    let result = [
      {
        type: 'application/x-mpegURL',
        src: `${videoFile.urls['hls-playlist']}?u=1`
      },
      {
        type: 'video/mp4',
        src: `${videoFile.urls[fallbackQuality]}?u=1`
      }
    ];

    if (videoFile.urls['dash-playlist']) {
      result = [
        {
          type: 'application/dash+xml',
          src: `${videoFile.urls['dash-playlist']}`
        }
      ].concat(result);
    }

    return result;
  }
  else {
    if (!videoFile.urls[quality]) {
      quality = fallbackQuality;
    }

    return [
      {
        type: 'video/mp4',
        src: `${videoFile.urls[quality]}?u=1`
      }
    ];
  }
}
