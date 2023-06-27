import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LollipopBarChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // D3 code to create the Lollipop Bar Chart
    const svg = d3.select(svgRef.current);

    // Set the dimensions and margins of the plot
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create an x-scale for the pH values
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.ph)])
      .range([0, width]);

    // Create a y-scale for the regions
    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.source_type))
      .range([0, height])
      .padding(0.2);

    // Add the lollipop circles
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.ph))
      .attr("cy", (d) => yScale(d.source_type) + yScale.bandwidth() / 2)
      .attr("r", 3)
      .attr("fill", "steelblue");

    // Add the vertical lines
    svg
      .append("g")
      .selectAll("line")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d.ph))
      .attr("x2", (d) => xScale(d.ph))
      .attr("y1", (d) => yScale(d.source_type))
      .attr("y2", (d) => yScale(d.source_type) + yScale.bandwidth())
      .attr("stroke", "steelblue")
      .style("stroke-width", 2);

    // Add the x-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("text-anchor", "middle");

    // Add the y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

    // y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2 - margin.top)
      .attr("y", margin.left - 50)
      .attr("text-anchor", "middle")
      .text("Region");
  }, [data]);

  return (
    <svg ref={svgRef} width="100%" height="300">
      {/* Add the chart */}
    </svg>
  );
};

export default LollipopBarChart;