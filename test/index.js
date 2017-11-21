const fs = require('fs')
const path = require('path')
const IndexedGeo = require('../index.js')
const test = require('tap').test

const indexedGeo = IndexedGeo()

const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.geojson')))

const feature = geojson.features[0]

const featureCollection = {
  type: 'FeatureCollection',
  features: geojson.features.slice(1)
}

indexedGeo.index(feature)
indexedGeo.index(featureCollection)

test('nearest', function (t) {
  const point = {
    type: 'Point',
    coordinates: [
      -73.91241073,
      40.7462165
    ]
  }

  const nearest = indexedGeo.nearest(point, 2)
    .map((feature) => feature.properties.id)

  t.same(nearest, [8, 10])
  t.end()
})

test('search', function (t) {
  const point = {
    type: 'Point',
    coordinates: [
      -73.9623641,
      40.7776817
    ]
  }

  const search = indexedGeo.search(point)
    .map((feature) => feature.properties.id)
    .sort((a, b) => a - b)

  t.same(search, [6, 9, 10, 11])
  t.end()
})

test('inside', function (t) {
  const point = {
    type: 'Point',
    coordinates: [
      -73.9623641,
      40.7776817
    ]
  }

  const inside = indexedGeo.inside(point)
    .map((feature) => feature.properties.id)
    .sort((a, b) => a - b)

  t.same(inside, [6, 9, 10])
  t.end()
})
