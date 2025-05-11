function mergeZoningData(zoningGeojson, zonePaths) {
  // Define map bounds based on Phoenix metro area
  const bounds = {
    minLng: -112.5,
    maxLng: -111.5,
    minLat: 33.2,
    maxLat: 33.9
  };

  const svgWidth = 800;
  const svgHeight = 600;

  function scaleLng(lng) {
    return ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * svgWidth;
  }

  function scaleLat(lat) {
    return svgHeight - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * svgHeight;
  }

  const zoningByZip = {};
  
  zoningGeojson.features.forEach(feature => {
    if (!feature.geometry || !feature.geometry.coordinates) return;

    let coordinates;
    if (feature.geometry.type === "MultiPolygon") {
      coordinates = feature.geometry.coordinates.reduce((largest, current) => 
        current[0].length > largest[0].length ? current : largest
      )[0];
    } else {
      coordinates = feature.geometry.coordinates[0];
    }

    // Create both SVG path and GeoJSON coordinates
    const svgPath = coordinates.reduce((pathStr, coord, i) => {
      const [lng, lat] = coord;
      const x = scaleLng(lng);
      const y = scaleLat(lat);
      return pathStr + (i === 0 ? `M${x} ${y}` : `L${x} ${y}`);
    }, '') + 'Z';

    const zipcode = feature.properties.LABEL1?.match(/\d{5}/)?.[0];
    if (zipcode) {
      zoningByZip[zipcode] = {
        svgPath,
        coordinates: coordinates,
        zoning: feature.properties.ZONING,
        zone: zonePaths[zipcode]?.zone || determineZone(coordinates)
      };
    }
  });

  // Create merged GeoJSON structure that works with both Leaflet and SVG
  const mergedFeatures = Object.entries(zoningByZip).map(([zipcode, data]) => ({
    type: "Feature",
    properties: {
      zipcode,
      zone: data.zone,
      zoning: data.zoning,
      svgPath: data.svgPath // For SVG rendering
    },
    geometry: {
      type: "Polygon",
      coordinates: [data.coordinates] // For Leaflet GeoJSON
    }
  }));

  return {
    type: "FeatureCollection",
    features: mergedFeatures
  };
}

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

export default mergeZoningData; 