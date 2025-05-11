// Import this in a test environment or temporary component
function testZoningMerge(zoningGeojson, zipcodeGeojson) {
  // Track zoning by zipcode
  const zoningByZip = {};

  // First pass - organize zipcode boundaries
  zipcodeGeojson.features.forEach(feature => {
    const zipcode = feature.properties.zipcode;
    zoningByZip[zipcode] = {
      zone: feature.properties.zone,
      coordinates: feature.geometry.coordinates[0],
      zoning: [] // Will store zoning designations that intersect this zipcode
    };
  });

  // Second pass - check which zoning areas intersect each zipcode
  zoningGeojson.features.forEach(feature => {
    if (!feature.geometry || !feature.geometry.coordinates) return;

    const zoning = feature.properties.ZONING;
    const coordinates = feature.geometry.coordinates[0];

    // Get centroid of zoning area
    const centroid = coordinates.reduce(
      (acc, coord) => ({
        x: acc.x + coord[0]/coordinates.length,
        y: acc.y + coord[1]/coordinates.length
      }),
      {x: 0, y: 0}
    );

    // Find which zipcode this zoning area belongs to
    Object.keys(zoningByZip).forEach(zipcode => {
      const zipBounds = zoningByZip[zipcode].coordinates;
      if (isPointInPolygon(centroid, zipBounds)) {
        if (!zoningByZip[zipcode].zoning.includes(zoning)) {
          zoningByZip[zipcode].zoning.push(zoning);
        }
      }
    });
  });

  // Create merged output
  return {
    type: "FeatureCollection",
    features: Object.entries(zoningByZip).map(([zipcode, data]) => ({
      type: "Feature",
      properties: {
        zipcode,
        zone: data.zone,
        zoning: data.zoning.join(', ')
      },
      geometry: {
        type: "Polygon",
        coordinates: [data.coordinates]
      }
    }))
  };
}

// Helper function to check if a point is inside a polygon
function isPointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Test function
function runZoningTest() {
  fetch('/data/zipcodes.geojson')
    .then(res => res.json())
    .then(zipcodeData => {
      fetch('/data/Zoning.geojson')
        .then(res => res.json())
        .then(zoningData => {
          const result = testZoningMerge(zoningData, zipcodeData);
          console.log('Merged Result:', result);
          console.log('Sample Feature:', result.features[0]);
          console.log('Total Features:', result.features.length);
        });
    });
}

export { testZoningMerge, runZoningTest }; 