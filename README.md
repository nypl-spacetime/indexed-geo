# indexed-geo

Indexed geospatial functions for Node.js, built using [Turf](http://turfjs.org/), [rbush](https://github.com/mourner/rbush) and [rbush-knn](https://github.com/mourner/rbush-knn).

## Installation & Usage

Installation:

    npm install nypl-spacetime/indexed-geo

Usage:

```js
const IndexedGeo = require('indexed-geo')

const polygons = JSON.parse(fs.readFileSync('polygons.geojson'))

const point = {
  type: 'Point',
  coordinates: [
    -73.954875,
    40.733697
  ]
}

const indexedGeo = IndexedGeo()
indexedGeo.index(polygons)

const results = indexedGeo.intersects(point)
// results now contains all the polygons intersecting with point
```

## API

### `index(geojson)`

Indexes GeoJSON object.

### `inside(point)`

Finds all indexed objects which intersect `point`.

### `nearest(point, k, filterFn)`

Finds `k` nearest neighbors. See [rbush-knn's documentation](https://github.com/mourner/rbush-knn#api) for details.
