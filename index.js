const rbush = require('rbush')
const knn = require('rbush-knn')
const turf = {
  bbox: require('@turf/bbox'),
  inside: require('@turf/inside')
}

module.exports = function () {
  let tree

  function index (geojson) {
    const treeSize = geojson.features.length

    tree = rbush(treeSize)
    const treeItems = geojson.features
      .map((feature) => ({
        bbox: turf.bbox(feature),
        feature
      }))
      .map((item) => ({
        minX: item.bbox[0],
        minY: item.bbox[1],
        maxX: item.bbox[2],
        maxY: item.bbox[3],
        feature: item.feature
      }))

    tree.load(treeItems)
  }

  function checkTree () {
    if (!tree) {
      throw new Error('Geospatial index is empty; index GeoJSON data before calling this function')
    }
  }

  function nearest (point, k, filterFn) {
    checkTree()

    if (tree) {
      return knn(tree, point.coordinates[0], point.coordinates[1], k, filterFn)
        .map((result) => result.feature)
    }
  }

  function inside (point) {
    checkTree()

    if (tree) {
      return tree
        .search({
          minX: point.coordinates[0],
          minY: point.coordinates[1],
          maxX: point.coordinates[0],
          maxY: point.coordinates[1]
        })
        .map((result) => result.feature)
        .filter((feature) => turf.inside(point, feature))
    }
  }

  return {
    index,
    nearest,
    inside
  }
}

