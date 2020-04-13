import '../frontend';
import {storiesOfContentElement, normalizeAndMergeFixture, filePermaId} from 'pageflow-scrolled/spec/support/stories';

import React, {useEffect} from 'react';
import {Entry, EntryStateProvider, EditorStateProvider} from 'pageflow-scrolled/frontend';

import {storiesOf} from '@storybook/react';

storiesOfContentElement(module, {
  typeName: 'textBlock',
  baseConfiguration: {
    children: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.'
  }
});

storiesOf('Editor/Inline Editing', module)
  .add('Text Block',
       () => {
         const seed = normalizeAndMergeFixture({
           sections: [
             {
               id: 1,
               configuration: {transition: 'scroll', backdrop: {image: filePermaId('imageFiles', 'turtle')}, fullHeight: true}
             },
             {
               id: 2,
               configuration: {transition: 'scroll', appearance: 'cards', backdrop: {image: filePermaId('imageFiles', 'turtle')}, fullHeight: true}
             }
           ],

           contentElements: [
             {sectionId: 1, typeName: 'heading', configuration: {children: 'Inline Editing'}},
             {sectionId: 1, typeName: 'editableTextBlock',
              configuration: {
                value: [
                  {type: 'paragraph', children: [{text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.'}]},
                  {type: 'paragraph', children: [{text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.'}]}
                ]
              }
             },
             {sectionId: 2, typeName: 'editableTextBlock', configuration: {value: [{type: 'paragraph', children: [{text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.'}]}]}}
           ]
         });

         useEffect(() => {
           var el = document.querySelector("[contenteditable] p");

           var range = document.createRange();
           range.selectNodeContents(el);
           var sel = window.getSelection();
           sel.removeAllRanges();
           sel.addRange(range);
         }, []);

         return (
           <EditorStateProvider active={true}>
             <EntryStateProvider seed={seed}>
               <Entry />
             </EntryStateProvider>
           </EditorStateProvider>
         );
       }
  );
