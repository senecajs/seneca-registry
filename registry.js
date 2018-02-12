/* Copyright (c) 2015-2018 Richard Rodger, MIT License */

'use strict'

const _ = require('lodash')

const intern = {}

module.exports = function() {
  var seneca = this

  // initialized in init:registry
  var store

  seneca.add('role:registry,cmd:set', cmd_set)
  seneca.add('role:registry,cmd:get', cmd_get)
  seneca.add('role:registry,cmd:remove', cmd_remove)
  seneca.add('role:registry,cmd:list', cmd_list)

  function cmd_set(msg, done) {
    var keyparts = intern.parsekey(msg.key)
    setparts(store, keyparts, msg.value)
    done()
  }

  function cmd_get(msg, done) {
    var keyparts = intern.parsekey(msg.key)
    done(null, { value: getparts(store, keyparts) })
  }

  function cmd_remove(msg, done) {
    var keyparts = intern.parsekey(msg.key)
    removeparts(store, keyparts, { recurse: msg.recurse })
    done()
  }

  function cmd_list(msg, done) {
    var keyparts = intern.parsekey(msg.key)
    done(null, { keys: listkeys(store, keyparts, { recurse: msg.recurse }) })
  }

  seneca.add('init:registry', function(msg, done) {
    // For *real* registries, execute async init calls as per registry Node.js API
    // to establish connection to registry cluster.
    store = {}
    done()
  })

  return {
    name: 'registry',

    // for unit testing
    exportmap: {
      store: function() {
        return store
      }
    }
  }
}

module.exports.intern = intern

intern.parsekey = function(keystr) {
  var parts = (keystr || '').split('/')
  return parts
}

function setparts(store, parts, value) {
  var part,
    current = store
  while ((part = parts.shift())) {
    current = current[part] = current[part] || {}
  }
  current.$ = value
}

function getparts(store, parts) {
  var part,
    current = store
  while (current && (part = parts.shift())) {
    current = current[part]
  }
  return current ? current.$ : void 0
}

// TODO: needs better testing
function removeparts(store, parts, flags) {
  var part,
    current = store,
    parent,
    parentpart
  while (current && (part = parts.shift())) {
    parent = current
    parentpart = part
    current = current[part]
  }

  if (parent) {
    if (flags.recurse) {
      delete parent[parentpart]
    } else if (parent[parentpart]) {
      delete parent[parentpart].$
    }
  }
}

function listkeys(store, parts, flags) {
  var part,
    current = store
  while (current && (part = parts.shift())) {
    current = current[part]
  }

  if (flags.recurse) {
    var list = []
    var stack = _.map(_.without(_.keys(current), '$'), function(part) {
      return { key: part, current: current[part] }
    })
    var entry

    while ((entry = stack.shift())) {
      list.push(entry.key)
      _.each(_.without(_.keys(entry.current), '$'), function(part) {
        stack.push({
          key: entry.key + '/' + part,
          current: entry.current[part]
        })
      })
    }

    return list
  } else return current ? _.without(_.keys(current), '$') : []
}
