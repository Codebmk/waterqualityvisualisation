import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ViolinPlotChart = ({data}) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const svg = d3.select(chartContainerRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const districts = Array.from(new Set(data.map(d => d.district)));

      const xScale = d3.scaleBand()
        .domain(districts)
        .range([0, width])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total_dissolved_salts)])
        .range([height, 0]);

      const violinPlot = d3
        .area()
        .x(d => xScale(d.district))
        .y0(d => yScale(d.total_dissolved_salts))
        .y1(d => yScale(-d.total_dissolved_salts))
        .curve(d3.curveCatmullRom);

      svg.selectAll(".violin")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "violin")
        .attr("d", d => {
          const value = d.total_dissolved_salts;
          const density = d3.kernelDensity()
            .sample(d3.range(1000).map(d => d * 0.1).map(xScale.invert))
            .kernel(d3.kernelEpanechnikov)
            .x(d => xScale(d))
            .bandwidth(0.5)
            .thresholds(30)(value);

          return violinPlot(density);
        });

      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

      svg.append("g")
        .call(d3.axisLeft(yScale));
  }, []);

  return <div ref={chartContainerRef}></div>;
};

export default ViolinPlotChart;
