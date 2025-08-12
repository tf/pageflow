import {RulesEngine} from 'editor/models/RulesEngine';
import {configurationContainer} from 'editor/models/mixins/configurationContainer'

import Backbone from 'backbone';

describe('RulesEngine', () => {
  const Model = Backbone.Model.extend({
    mixins: [configurationContainer()]
  });

  const Collection = Backbone.Collection.extend({
    model: Model
  });

  it('runs rules against registered collections', () => {
    const engine = new RulesEngine();
    const contentElements = new Collection([
      {id: 1, typeName: 'image', configuration: {imageFileId: 10}},
      {id: 2, typeName: 'image', configuration: {imageFileId: 11}},
    ]);
    const imageFiles = new Collection([
      {id: 10, configuration: {}},
      {id: 11, configuration: {alt: 'Some text'}},
    ]);
    const callback = jest.fn();

    engine.registerCollection('contentElements', contentElements);
    engine.registerCollection('imageFiles', imageFiles);

    engine.registerRule({
      name: 'missingAltText',
      level: 'warning',

      targets(context) {
        return context.query('contentElements', {typeName: 'image'})
      },

      evaluate(context, contentElement) {
        const imageFile = context.get(
          'imageFiles',
          context.getConfigurationAttribute(contentElement, 'imageFileId')
        );

        if (imageFile && !context.getConfigurationAttribute(imageFile, 'alt')) {
          return {
            target: contentElement,
            propertyName: 'imageFileId'
          }
        }
      }
    });

    engine.evalutate(callback);

    expect(callback).toHaveBeenCalledWith([
      {
        name: 'missingAltText',
        level: 'warning',
        propertyName: 'imageFileId',
        target: contentElements.get(1)
      }
    ]);
  });

  it('tracks properties accessed during rule evaluation and re-runs rule on change', () => {
    const engine = new RulesEngine();
    const contentElements = new Collection([
      {id: 1, typeName: 'image', configuration: {imageFileId: 10}},
      {id: 2, typeName: 'image', configuration: {imageFileId: 11}},
    ]);
    const imageFiles = new Collection([
      {id: 10, configuration: {alt: 'Some text'}},
      {id: 11, configuration: {alt: 'Some text'}},
      {id: 12, configuration: {alt: ''}},
    ]);
    const callback = jest.fn();

    engine.registerCollection('contentElements', contentElements);
    engine.registerCollection('imageFiles', imageFiles);

    engine.registerRule({
      name: 'missingAltText',
      level: 'warning',

      targets(context) {
        return context.query('contentElements', {typeName: 'image'})
      },

      evaluate(context, contentElement) {
        const imageFile = context.get(
          'imageFiles',
          context.getConfigurationAttribute(contentElement, 'imageFileId')
        );

        if (imageFile && !context.getConfigurationAttribute(imageFile, 'alt')) {
          return {
            target: contentElement,
            propertyName: 'imageFileId'
          }
        }
      }
    });

    engine.evalutate(callback);

    expect(callback).toHaveBeenCalledWith([]);
    callback.mockReset();

    imageFiles.get(10).configuration.set('alt', '')

    expect(callback).toHaveBeenCalledWith([
      {
        name: 'missingAltText',
        level: 'warning',
        propertyName: 'imageFileId',
        target: contentElements.get(1)
      }
    ]);
    callback.mockReset();

    contentElements.get(2).configuration.set('imageFileId', 12)

    expect(callback).toHaveBeenCalledWith([
      {
        name: 'missingAltText',
        level: 'warning',
        propertyName: 'imageFileId',
        target: contentElements.get(1)
      },
      {
        name: 'missingAltText',
        level: 'warning',
        propertyName: 'imageFileId',
        target: contentElements.get(2)
      }
    ]);
  });
});
