const loki = require('lokijs')

module.exports = () => {

  return new Promise((resolve, reject) => {

    if(module.exports.db){
      resolve(module.exports.db)
    }

    // implement the autoloadback referenced in loki constructor
    const onLoad = () => {
      let stats = db.getCollection("stats");

      if (stats === null) {
        stats = db.addCollection("stats");
      }

      resolve(module.exports.db)
    }

    const db = new loki('data.json', {
        autoload: true,
        autoloadCallback : onLoad,
        autosave: true,
        autosaveInterval: 4000
    });

    module.exports.db = db
  })

}
