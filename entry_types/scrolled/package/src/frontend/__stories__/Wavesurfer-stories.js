import React, {useState, useEffect} from 'react';

import Wavesurfer from '../PlayerControls/WaveformPlayerControls/Wavesurfer';
import {RootProviders, useFile} from 'pageflow-scrolled/frontend';
import {normalizeAndMergeFixture, filePermaId} from 'pageflow-scrolled/spec/support/stories';

export default {
  title: 'Frontend/Wavesurfer',
  parameters: {
    percy: {skip: true}
  },
  decorators: [
    (Story) =>
      <RootProviders seed={normalizeAndMergeFixture({})}>
        <Story />
      </RootProviders>
  ]
}

export function WaveformStressTest() {
  const audioFiles = [
    useFile({collectionName: 'audioFiles',
             permaId: filePermaId('audioFiles', 'd1042')}),
    useFile({collectionName: 'audioFiles',
             permaId: filePermaId('audioFiles', 'd565')}),
    useFile({collectionName: 'audioFiles',
             permaId: filePermaId('audioFiles', 'd244')}),
    useFile({collectionName: 'audioFiles',
             permaId: filePermaId('audioFiles', 'd173')})
  ];

  return (
    <div>
      <NewTabButton />
      <StressTest>
        {(loaded) => loaded ?
                     audioFiles.map(audioFile =>
                       <Player audioFile={audioFile} />
                     ) : null}
      </StressTest>
    </div>
  );
}

function Player({audioFile}) {
  const [peaks, setPeaks] = useState(null);

  useEffect(() => {
    fetch(audioFile.urls.mp3.replace('audio.mp3', 'peaks.json'))
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(peaks => {
        console.log('loaded peaks! sample_rate: ' + peaks.sample_rate);
        setPeaks(peaks.data);
      });
  }, [audioFile]);

  return (
    <div>
      <audio src={audioFile.urls.mp3} controls id={`thePlayer${audioFile.id}`} />
      {peaks && <Wavesurfer mediaElt={`#thePlayer${audioFile.id}`}
                            audioPeaks={peaks}
                            options={{normalize: true,
                                      removeMediaElementOnDestroy: false,
                                      hideScrollbar: true}} />}
    </div>
  );
}

function StressTest({children}) {
  const [counter, setCounter] = useState(0);

  function* start() {
    let i = 40
    while(i > 0) {
      i = i - 1;
      setCounter(counter => counter + 1);
      yield delay(100);
      setCounter(counter => counter + 1);
      yield delay(2000);
    }
  }

  return (
    <div>
      <button onClick={() => run(start())}>Start</button>
      <br />
      {counter}/
      {children(counter % 2 === 0)}
    </div>
  )
}

function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function run(commands) {
  for (let c of commands) {
    await c;
  }
}

function NewTabButton() {
  if (window.parent === window) {
    return null;
  }

  return (
    <button onClick={() => window.open(window.location.href, '_blank')}>Open frame in new tab</button>
  );
}
