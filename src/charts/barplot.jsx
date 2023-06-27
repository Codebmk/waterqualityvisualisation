import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';

const BarPlot = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // D3 code to create the bar plot
    const svg = d3.select(svgRef.current);

    // Set the dimensions and margins of the plot
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 1200;
    const height = 400 - margin.top - margin.bottom;

    // Calculate the average water quality for each region
    const regionData = Array.from(
      d3.group(data, d => d.region),
      ([key, values]) => ({
        region: key,
        pH: d3.mean(values, d => d.ph)
      })
    );

    // Create x and y scales
    const xScale = d3
      .scaleBand()
      .domain(regionData.map(d => d.region))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(regionData, d => d.pH)])
      .range([height, 0]);

    // Add x-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
      .call(d3.axisBottom(xScale));

    // x-axis label
    svg
      .append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', height + margin.top + 50)
      .attr('text-anchor', 'middle')
      .text('Region');

    // Add y-axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

    // y-axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - margin.top)
      .attr('y', margin.left - 50)
      .attr('text-anchor', 'middle')
      .text('Average Water Quality');

    // Add bars
    svg
      .selectAll('rect')
      .data(regionData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.region) + margin.left)
      .attr('y', d => yScale(d.pH) + margin.top)
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.pH))
      .attr('fill', 'yellowgreen');

  }, [data]);

  return (
    <div>
    <svg ref={svgRef} width="100%" height="400">
      {/* Add axes and bars */}
    </svg>
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Box width={"20px"} height={"20px"} backgroundColor={"yellowgreen"} />
          <Typography variant="body2" sx={{ m: 1 }}>
          pH
          </Typography>
        </Box>
    </div>
  );
};

export default BarPlot;
