var express = require('express');
var db = require('../createDB');
var router = express.Router();

/* Create new user */
router.post('/:collection', function(req, res, next) {
  // In middleware, we already made sure the table exists, no fear of sql-injection
  let table = req.params.collection;
  let query = "INSERT INTO " + table + "(name, addr) VALUES($name, $addr)";
  db.conn().run(query, {
    $name: req.body.name,
    $addr: req.body.addr
  }, 
  (err) => {
    if(err){
      return res.status(500).send({msg: 'Insertion failed', err: err.message});
    }

    return res.status(200).send({msg: "New record added"})
  })
});

function isInt(field){
  if(isNaN(field)) return false;
  return parseInt(Number(field)) == field;
}

/* get user details by id */
router.get('/:collection/:id', function(req, res, next) {
  if(!isInt(req.params.id)) return res.status(500).send({msg: "id should be integer"});
  
  // In middleware, we already made sure the table exists, no fear of sql-injection
  let table = req.params.collection;
  let query = "SELECT * FROM " + table + " WHERE __id=$id";
  db.conn().get(query, {
    $id: req.params.id
  }, 
  (err, row) => {
    if(err){
      return res.status(500).send({msg: 'Retrieval of the record failed', err: err.message});
    }
    //check if record exists
    if(row && Object.keys(row).length != 0)
      return res.status(200).send(row);
    else 
      return res.status(400).send({msg: "Record not found"});
  })
});

/* Update the record */
router.post('/:collection/:id', function(req, res, next) {
  // In middleware, we already made sure the table exists, no fear of sql-injection
  let table = req.params.collection;
  let query = "UPDATE " + table + " SET ";
  let params = {$id: req.params.id};
  let first = true;

  //Update field provided in request body IF it's present in db scema 
  db.schema.tables[table].cols.forEach(col => {
    if(col.name in jsonBody){
      if(!first) query += " ,";
      
      first = false;
      query += " " + col.name + "=$" + col.name + " ";
      params['$' + col.name] = jsonBody[col.name];
    }
  });

  query += " WHERE __id=$id"

  db.conn().run(query, params, 
    function (err) {
      if(err){
        return res.status(500).send({msg: 'Unable to update the record.', err: err.message});
      }
      if(this.changes)
        return res.status(200).send({msg: "Record updated"});
      else
        return res.status(400).send({msg: "No record updated. Check the id"});
    })
});

/* Delete the record. */
router.delete('/:collection/:id', function(req, res, next) {
  if(!isInt(req.params.id)) return res.status(500).send({msg: "id should be integer"});
  
  // In middleware, we already made sure the table exists, no fear of sql-injection
  let table = req.params.collection;
  let query = "DELETE FROM " + table + " WHERE __id=$id";
  db.conn().run(query, {
    $id: req.params.id
  }, 
  function (err){
    if(err){
      return res.status(500).send({msg: 'Unable to update the record.', err: err.message});
    }

    if(this.changes) return res.status(200).send({msg: "Record deleted"});
    else return res.status(400).send({msg: "No record found. Check the id"})
  })
});

module.exports = router;