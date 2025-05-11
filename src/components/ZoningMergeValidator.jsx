import React, { useEffect, useState } from 'react';
import { testZoningMerge } from '../utils/testZoningMerge';
import { validateZoningMerge } from '../utils/validateZoningMerge';

const ZoningMergeValidator = () => {
  const [validation, setValidation] = useState(null);
  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [polygonData, setPolygonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SVG viewport settings
  const viewportWidth = 800;
  const viewportHeight = 600;
  const bounds = {
    minLng: -112.5,
    maxLng: -111.5,
    minLat: 33.2,
    maxLat: 33.9
  };

  function scaleLng(lng) {
    return ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * viewportWidth;
  }

  function scaleLat(lat) {
    return viewportHeight - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * viewportHeight;
  }

  function generateSvgPath(coordinates) {
    return coordinates.map((coord, i) => {
      const x = scaleLng(coord[0]);
      const y = scaleLat(coord[1]);
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    }).join(' ') + 'Z';
  }

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [zipcodeData, zoningData] = await Promise.all([
          fetch('/data/zipcodes.geojson').then(res => res.json()),
          fetch('/data/Zoning.geojson').then(res => res.json())
        ]);

        const mergedResult = testZoningMerge(zoningData, zipcodeData);
        const validationResult = validateZoningMerge(mergedResult, zipcodeData);
        
        if (validationResult) {
          setValidation(validationResult);
          setPolygonData({
            original: zipcodeData,
            merged: mergedResult
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!validation || !polygonData) return <div>No data available</div>;

  return (
    <div>
      <h2>Zoning Merge Validation</h2>
      
      <div className="validation-stats">
        <h3>Validation Results</h3>
        <p>Total Zipcodes: {validation.totalZipcodes}</p>
        <p>Merged Zipcodes: {validation.mergedZipcodes}</p>
        <p>Issues Found: {validation.issues.length}</p>
      </div>

      <div className="comparison-view">
        <select 
          onChange={(e) => setSelectedZipcode(e.target.value)}
          value={selectedZipcode || ''}
        >
          <option value="">Select Zipcode</option>
          {validation?.coordinateComparisons.map(comp => (
            <option key={comp.zipcode} value={comp.zipcode}>
              {comp.zipcode} ({comp.match ? '✓' : '!'})
            </option>
          ))}
        </select>

        <div className="svg-container" style={{display: 'flex'}}>
          <svg width={viewportWidth} height={viewportHeight} style={{border: '1px solid #ccc'}}>
            {selectedZipcode && (
              <>
                {/* Original boundary */}
                <path
                  d={generateSvgPath(polygonData.original.features.find(
                    f => f.properties.zipcode === selectedZipcode
                  ).geometry.coordinates[0])}
                  fill="none"
                  stroke="blue"
                  strokeWidth="1"
                />
                {/* Merged boundary */}
                <path
                  d={generateSvgPath(polygonData.merged.features.find(
                    f => f.properties.zipcode === selectedZipcode
                  ).geometry.coordinates[0])}
                  fill="none"
                  stroke="red"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ZoningMergeValidator; 