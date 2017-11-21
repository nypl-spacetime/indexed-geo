const rbush = require('rbush')
const knn = require('rbush-knn')
const turf = {
  bbox: require('@turf/bbox'),
  booleanPointInPolygon: require('@turf/boolean-point-in-polygon')
}

function featureToItem (feature) {
  const bbox = turf.bbox(feature)

  return {
    minX: bbox[0],
    minY: bbox[1],
    maxX: bbox[2],
    maxY: bbox[3],
    feature
  }
}

module.exports = function () {
  const tree = rbush()

  function index (geojson) {
    if (geojson.type === 'FeatureCollection' && geojson.features) {
      tree.load(geojson.features.map(featureToItem))
    } else if (geojson.type === 'Feature') {
      tree.insert(featureToItem(geojson))
    } else {
      throw new Error('Expecting a GeoJSON FeatureCollection or a GeoJSON Feature')
    }
  }

  function nearest (point, k, filterFn) {
    return knn(tree, point.coordinates[0], point.coordinates[1], k, filterFn)
      .map((result) => result.feature)
  }

  function search (point) {
    return tree
      .search({
        minX: point.coordinates[0],
        minY: point.coordinates[1],
        maxX: point.coordinates[0],
        maxY: point.coordinates[1]
      })
      .map((result) => result.feature)
  }

  function inside (point) {
    return search(point)
      .filter((feature) => turf.booleanPointInPolygon(point, feature))
  }

  return {
    index,
    nearest,
    search,
    inside
  }
}
