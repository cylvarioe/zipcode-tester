function validateZoningMerge(mergedData, originalZipcodes) {
  // Guard against undefined inputs
  if (!mergedData?.features || !originalZipcodes?.features) {
    console.error('Invalid input data for validation');
    return null;
  }

  // Validation results
  const validation = {
    totalZipcodes: originalZipcodes.features.length,
    mergedZipcodes: mergedData.features.length,
    coordinateComparisons: [],
    issues: []
  };

  // Compare each merged feature with original
  mergedData.features.forEach(mergedFeature => {
    const zipcode = mergedFeature.properties.zipcode;
    const originalFeature = originalZipcodes.features.find(
      f => f.properties.zipcode === zipcode
    );

    if (!originalFeature) {
      validation.issues.push(`Missing zipcode ${zipcode} in merged data`);
      return;
    }

    // Compare coordinate counts
    const mergedCoords = mergedFeature.geometry.coordinates[0];
    const originalCoords = originalFeature.geometry.coordinates[0];
    
    validation.coordinateComparisons.push({
      zipcode,
      originalPoints: originalCoords.length,
      mergedPoints: mergedCoords.length,
      match: originalCoords.length === mergedCoords.length
    });
  });

  return validation;
}

export { validateZoningMerge }; 