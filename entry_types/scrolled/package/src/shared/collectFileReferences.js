/**
 * Find the file references a configuration contains.
 *
 * @param {Object} options
 * @param {Array} options.locations - File reference locations of the subject's schema.
 * @param {Object} options.configuration - Configuration to read perma ids from.
 *
 * @private
 */
export function collectFileReferences({locations, configuration}) {
  return locations.flatMap(location =>
    valuesAt(configuration, location.path)
      .flatMap(({path, value}) => location.richText ?
        richTextReferences(value, path) :
        [{path, value, collectionName: location.collection}])
      .map(({path, value, collectionName}) => ({path, permaId: toPermaId(value), collectionName}))
      .filter(({permaId}) => permaId)
      .map(({path, permaId, collectionName}) => ({
        collectionName,
        permaId,
        path,
        active: isActive(location.activeIf, configuration)
      }))
  );
}

function richTextReferences(nodes, path) {
  if (!Array.isArray(nodes)) {
    return [];
  }

  return nodes.flatMap((node, index) => {
    const nodePath = [...path, String(index)];
    const file = node.type === 'link' && node.href?.file;
    const references = file?.collectionName ?
      [{path: [...nodePath, 'href', 'file', 'permaId'],
        value: file.permaId, collectionName: file.collectionName}] : [];

    return [...references, ...richTextReferences(node.children, [...nodePath, 'children'])];
  });
}

// Backdrops of legacy sections store a color in the property that
// otherwise holds an image perma id.
function toPermaId(value) {
  const permaId = Number(value);

  return Number.isInteger(permaId) && permaId > 0 ? permaId : null;
}

function valuesAt(value, path, resolvedPath = []) {
  if (value === null || value === undefined) {
    return [];
  }

  if (!path.length) {
    return [{path: resolvedPath, value}];
  }

  const [segment, ...rest] = path;

  if (segment === '*') {
    return Object.entries(value).flatMap(
      ([key, item]) => valuesAt(item, rest, [...resolvedPath, key])
    );
  }

  return valuesAt(value[segment], rest, [...resolvedPath, segment]);
}

function isActive(activeIf, configuration) {
  if (!activeIf) {
    return true;
  }

  return [activeIf].flat().every(condition => matches(condition, configuration));
}

function matches(condition, configuration) {
  const value = valueAt(configuration, condition.path);

  if ('present' in condition) {
    return (value !== null && value !== undefined) === condition.present;
  }

  if ('not' in condition) {
    return ![condition.not].flat().includes(value);
  }

  return [condition.value].flat().includes(value);
}

function valueAt(configuration, path) {
  return path.reduce((value, segment) => value?.[segment], configuration);
}
