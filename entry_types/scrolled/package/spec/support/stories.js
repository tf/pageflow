import React from 'react';
import Entry from '../../src/frontend/Entry';
import {EntryStateProvider} from '../../src/entryState';
import {normalizeSeed} from './normalizeSeed';
import {storiesOf} from '@storybook/react';

import seedFixture from '../../tmp/seed.json'

export function storiesOfContentElement(module, {typeName, exampleConfiguration}) {
  const stories = storiesOf(`Content Elements/${typeName}`, module);

  exampleSeeds({typeName, exampleConfiguration}).forEach(({title, seed: normalizeSeed}) => {
    const seed = {
      ...seedFixture,
      collections: {
        ...seedFixture.collections,
        chapters: normalizeSeed.collections.chapters,
        sections: normalizeSeed.collections.sections,
        contentElements: normalizeSeed.collections.contentElements
      }
    };

    stories.add(title, () =>
      <EntryStateProvider seed={seed}>
        <Entry />
      </EntryStateProvider>)
  });
}

function exampleSeeds({typeName, exampleConfiguration}) {
  return [
    layoutStories({
      typeName,
      exampleConfiguration
    }),

    exampleSeed({
      title: 'Layout - Left',
      typeName,
      exampleConfiguration,
      sectionConfiguration: {layout: 'left'}
    }),
    exampleSeed({
      title: 'Layout - Center',
      typeName,
      exampleConfiguration,
      sectionConfiguration: {layout: 'center'}
    }),
    exampleSeed({
      title: 'Layout - Right',
      typeName,
      exampleConfiguration,
      sectionConfiguration: {layout: 'right'}
    })
  ]
}

function exampleSeed({title, typeName, exampleConfiguration, sectionConfiguration}) {
  return {
    title,
    seed: normalizeSeed({
      sections: [
        {
          id: 10,
          configuration: {transition: 'scroll', backdrop: {image: '#000'}, fullHeight: false, ...sectionConfiguration}
        }
      ],
      contentElements: [
        {sectionId: 10, typeName: 'heading', configuration: {children: title}},
        {sectionId: 10, typeName, configuration: exampleConfiguration}
      ]
    })
  };
}

function layoutStories({typeName, exampleConfiguration}) {
  return {
    title: 'Layout',
    seed: normalizeSeed({
      sections: [
        {
          id: 10,
          configuration: {transition: 'scroll', backdrop: {image: '#000'}, layout: 'left', fullHeight: false}
        },
        {
          id: 11,
          configuration: {transition: 'scroll', backdrop: {image: '#000'}, layout: 'center', fullHeight: false}
        },
        {
          id: 12,
          configuration: {transition: 'scroll', backdrop: {image: '#000'}, layout: 'right', fullHeight: false}
        }

      ],
      contentElements: [
        {sectionId: 10, typeName: 'heading', configuration: {children: 'Left.'}},
        {sectionId: 10, typeName, configuration: exampleConfiguration},
        {sectionId: 11, typeName: 'heading', configuration: {children: 'Center'}},
        {sectionId: 11, typeName, configuration: exampleConfiguration},
        {sectionId: 12, typeName: 'heading', configuration: {children: 'Right'}},
        {sectionId: 12, typeName, configuration: exampleConfiguration}
      ]
    })
  };
}
