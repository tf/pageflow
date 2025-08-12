export class RulesEngine {
  constructor() {
    this.collections = {};
    this.rules = [];
  }

  registerCollection(name, collection) {
    this.collections[name] = collection;
  }

  registerRule(rule) {
    this.rules.push(rule);
  }

  evalutate(callback) {
    const collections = this.collections;

    const context = {
      get(collectionName, id) {
        return collections[collectionName].get(id);
      },

      query(collectionName, conditions) {
        return collections[collectionName].where(conditions);
      },

      getConfigurationAttribute(handle, attributeName) {
        return handle.configuration.get(attributeName);
      },
    }



    callback(this.rules.flatMap(rule =>
      rule
        .targets(context).flatMap(target =>
          rule.evaluate(context, target)
        )
        .filter(Boolean)
        .map(issue => ({
          ...issue,
          name: rule.name,
          level: rule.level
        }))
    ));
  }
}
