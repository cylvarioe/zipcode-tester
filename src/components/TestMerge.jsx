import React, { useEffect } from 'react';
import { runZoningTest } from '../utils/testZoningMerge';
import { zonePaths } from './ZipcodeGame/zonePaths';

const TestMerge = () => {
  useEffect(() => {
    runZoningTest(zonePaths);
  }, []);

  return (
    <div>
      <h2>Testing Zoning Merge</h2>
      <p>Check console for results</p>
    </div>
  );
};

export default TestMerge; 