import PouchDB from 'pouchdb-browser';

export default class PouchModel extends PouchDB {
  async findAll() {
    const allDocs = await this.allDocs({
      include_docs: true
    })
    return allDocs.rows.map(row => row.doc)
  }

  destroyAll(collection) {
    const forDelete = collection.map(function(item) {
      var o = Object.assign({}, item);
      o._deleted = true;
      return o;
    })
    
    this.bulkDocs(forDelete);
  }

  create(params) {
    this.post(params).then(function (response) {

    }).catch(function (err) {
      console.log(err);
    });
  }

  update(id, params) {
    const self = this; 
    
    self.get(id).then(function(doc) {
      return self.put(Object.assign({}, doc, params))
    }).catch(function (err) {
      console.log(err);
    });
  }

  destroy(id) {
    const self = this; 
    
    self.get(id).then(function(doc) {
      return self.remove(doc);
    })
  }
}
