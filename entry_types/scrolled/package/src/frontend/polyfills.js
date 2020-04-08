import 'core-js/features/array/fill';
import 'core-js/features/object/assign';
import 'core-js/features/string/starts-with';

import 'intersection-observer';

// Make sure we're in a Browser-like environment before importing polyfills
// This prevents `fetch()` from being imported in a Node test environment
if (typeof window !== 'undefined') {
  require('whatwg-fetch');
}
