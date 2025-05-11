function determineZone(coordinates) {
  const centroid = coordinates.reduce(
    (acc, coord) => ({
      x: acc.x + coord[0]/coordinates.length,
      y: acc.y + coord[1]/coordinates.length
    }),
    {x: 0, y: 0}
  );
  
  // Central Phoenix (Zone 1 - Dark Green)
  if (centroid.x >= -112.1 && centroid.x <= -111.95 &&
      centroid.y >= 33.4 && centroid.y <= 33.6) {
    return 1;
  }
  
  // North East (Zone 2 - Dark Blue)
  if (centroid.x >= -111.95 && centroid.y >= 33.5) {
    return 2;
  }
  
  // North West (Zone 3 - Orange)
  if (centroid.x <= -112.1 && centroid.y >= 33.5) {
    return 3;
  }
  
  // South East (Zone 4 - Yellow)
  if (centroid.x >= -111.95 && centroid.y <= 33.5) {
    return 4;
  }
  
  // South West (Zone 5 - Red)
  if (centroid.x <= -112.1 && centroid.y <= 33.5) {
    return 5;
  }
  
  // Default to central if no other match
  return 1;
}

export function updateZones(geojsonData) {
  return {
    ...geojsonData,
    features: geojsonData.features.map(feature => ({
      ...feature,
      properties: {
        ...feature.properties,
        zone: determineZone(feature.geometry.coordinates[0])
      }
    }))
  };
}

export default updateZones; 