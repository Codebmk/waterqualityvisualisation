import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PackedCircleChart = ({dataset}) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    createChart();
  }, []);


  const createChart = () => {
    const width = 975;
    const height = width;
    const color = d3.scaleSequential([8, 0], d3.interpolateMagma);
    
    const svg = d3.select(chartContainerRef.current);

    
  };

  return (
    <div className="circle-pack-container">
      <h6>Entire dataset circle pack</h6>
      <div className="circle-pack-chart" ref={chartContainerRef}></div>
    </div>
  );
};

export default PackedCircleChart;
