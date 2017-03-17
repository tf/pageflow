import {createSelector, createStructuredSelector} from 'reselect';

const SELECTOR_FACTORY = Symbol('selectorFactory');
const CREATE_SELECTOR = Symbol('createSelector');

export default function memoizedSelector(...args) {
  return mark(function selectorCreator(stateOrCreateSelectorSymbol, props) {
    const inputSelectors = args.slice(0, -1).map(unwrap);
    const transform = args.slice(-1)[0];

    const selector = createSelector(...inputSelectors, transform);

    if (stateOrCreateSelectorSymbol === CREATE_SELECTOR) {
      return selector;
    }
    else if (stateOrCreateSelectorSymbol) {
      return selector(stateOrCreateSelectorSymbol, props);
    }
    else {
      throw 'Missing state argument for selector.';
    }
  });
}

export function combine(selectors, name) {
  return mark(function combinedSelectorCreator() {
    const s = unwrapAll(replaceScalarsWithConstantFunctions(selectors));
    const keys = Object.keys(s);

    const i = keys.map(key => s[key]);

    let last;

    return createSelector(
      state => state.__pages_connectedId,
      ...i,
      function(cid, ...r) {
        if (last) {
          const changed = [];

          r.forEach((rr, i) => {
            if (rr !== last[i]) {
              changed.push(keys[i]);
            }
          });

          console.log('calc', name, cid, changed);
        }
        else {
          console.log('calc', name, cid);
        }

        last = r;

        return keys.reduce((result, key, i) => {
          result[key]= r [i];
          return result;
        }, {});
      }
    );
  });
}

function unwrapAll(selectors) {
  return Object.keys(selectors).reduce((result, key) => {
    result[key] = unwrap(selectors[key]);
    return result;
  }, {});
}

function replaceScalarsWithConstantFunctions(object) {
  return Object.keys(object).reduce((result, key) => {
    if (typeof object[key] == 'function') {
      result[key] = object[key];
    }
    else {
      result[key] = () => object[key];
    }

    return result;
  }, {});
}

export function unwrap(selector) {
  if (typeof selector == 'function' && selector[SELECTOR_FACTORY]) {
    return selector(CREATE_SELECTOR);
  }
  else {
    return selector;
  }
}

function mark(selectorFactory) {
  selectorFactory[SELECTOR_FACTORY] = true;
  return selectorFactory;
}
