const presets = [
  [
    "@babel/env",
    {
      "corejs": 3,
      "useBuiltIns": "usage"
    }
  ],
];

module.exports = {
  presets,
  exclude: [
    '../../node_modules/**',
    'node_modules/**'
  ]
};
