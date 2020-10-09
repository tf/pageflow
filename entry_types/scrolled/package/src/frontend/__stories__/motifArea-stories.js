import React from 'react';
import {storiesOf} from '@storybook/react';

import {Entry, RootProviders} from 'pageflow-scrolled/frontend';
import {MotifAreaVisibilityProvider} from '../MotifArea';

import './v.module.css';

import {
  normalizeAndMergeFixture,
  filePermaId,
  exampleHeading,
  exampleTextBlock
} from 'pageflow-scrolled/spec/support/stories';

const stories = storiesOf('Frontend/Motif Area', module)
  .addParameters({percy: {skip: true}});

exampleStory( {
  transition1: 'fade',
  transition2: 'scroll',
  motifAreaPosition: 'top',
  fullHeight: true,
  title: 'Fade In/Motif Top',
  notes: [`
    A section entering with a fade transition will always full height.
    When scrolling fast, the section content will already have reached
    the upper viewport half when the fade transition finishes.
    It thus makes sense to shift the content  even when the motif area
    fits in the upper viewport half.
  `]
});

exampleStory( {
  transition1: 'fade',
  transition2: 'scroll',
  motifAreaPosition: 'bottom',
  fullHeight: true,
  title: 'Fade In/Motif Bottom',
  notes: [`
    Works exactly like previous example.
    Content is shifted down to prevent entering content from overlapping motif area.
  `]
});

exampleStory( {
  transition1: 'fade',
  transition2: 'fade',
  motifAreaPosition: 'top',
  fullHeight: true,
  textBlocks: 0,
  title: 'Fade In/No Content',
  notes: [`
    Even if there is no content, the section will always have full height and thus
    allow looking at the motif area. 
  `]
});

// fadeBg

exampleStory( {
  transition1: 'fadeBg',
  transition2: 'scroll',
  motifAreaPosition: 'top',
  fullHeight: true,
  title: 'Fade In Bg/Motif Top',
  notes: [`
    Even if there is no content, the section will always have full height and thus
    allow looking at the motif area.
  `]
});

exampleStory( {
  transition1: 'fadeBg',
  transition2: 'scroll',
  motifAreaPosition: 'bottom',
  fullHeight: true,
  title: 'Fade In Bg/Motif Bottom',
  notes: [`
    Even if there is no content, the section will always have full height and thus
    allow looking at the motif area.
  `]
});

exampleStory( {
  transition1: 'fadeBg',
  transition2: 'scroll',
  motifAreaPosition: 'bottom',
  fullHeight: true,
  textBlocks: 0,
  title: 'Fade In Bg/Motif Bottom',
  notes: [`
    Even if there is no content, the section will always have full height and thus
    allow looking at the motif area.
  `]
});


function exampleStory(options) {
  stories.add(
    options.title,
    () =>
      <RootProviders seed={exampleSeed(options)}>
        <MotifAreaVisibilityProvider visible={true}>
          <Entry />
        </MotifAreaVisibilityProvider>
      </RootProviders>
  )
}

function exampleSeed({transition1, transition2, motifAreaPosition, fullHeight, title, notes, textBlocks = 2}) {
  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          transition: 'fade',
          backdrop: {
            image: filePermaId('imageFiles', 'turtle')
          },
          fullHeight: true
        }
      },
      {
        id: 2,
        configuration: {
          transition: transition1,
          backdrop: {
            image: filePermaId('imageFiles', 'churchBefore'),
            imageMotifArea: {
              left: 5,
              top: motifAreaPosition === 'top' ? 5 : 70,
              width: 50,
              height: 25
            }
          },
          fullHeight
        }
      },
      {
        id: 3,
        configuration: {
          transition: transition2,
          backdrop: {
            image: filePermaId('imageFiles', 'churchAfter')
          },
          fullHeight: true
        }
      },
    ],
    contentElements: [
      exampleHeading({sectionId: 1, text: title}),
      exampleTextBlock({sectionId: 1, paragraphs: notes}),
      ...(Array(textBlocks).fill().map(() => exampleTextBlock({sectionId: 2}))),
      exampleHeading({sectionId: 3, text: `Transition ${transition2}`}),
      exampleTextBlock({sectionId: 3}),
    ]
  })
}
