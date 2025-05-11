import React, { useEffect } from 'react';
import { runZoningTest } from '../utils/testZoningMerge';

const TestZoningMerge = () => {
  useEffect(() => {
    runZoningTest();
  }, []);

  return (
    <div>
      <h2>Testing Zoning/Zipcode Merge</h2>
      <p>Check console for results</p>
    </div>
  );
};

export default TestZoningMerge; 