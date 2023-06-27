import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';

const ScatterPlot = ({ data }) => {
  const svgRef = useRef(null);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    // D3 code to create the scatter plot
    // Chart dimensions
  const width = 1200;
  const height = 300;

  const margin = { top: 25, right: 20, bottom: 35, left: 40 };

  const svg = d3
    .select(svgRef.current)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.ph))
    .nice()
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.phosphates_p))
    .nice()
    .range([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  setColors(color);

  const shape = d3.scaleOrdinal(
    data.map((d) => d.category),
    d3.symbols.map((s) => d3.symbol().type(s)())
  );

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", width)
          .attr("y", margin.bottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(data.ph)
      );

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(data.y)
      );

  const grid = (g) =>
    g
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .call((g) =>
        g
          .append("g")
          .selectAll("line")
          .data(x.ticks())
          .join("line")
          .attr("x1", (d) => 0.5 + x(d))
          .attr("x2", (d) => 0.5 + x(d))
          .attr("y1", margin.top)
          .attr("y2", height - margin.bottom)
      )
      .call((g) =>
        g
          .append("g")
          .selectAll("line")
          .data(y.ticks())
          .join("line")
          .attr("y1", (d) => 0.5 + y(d))
          .attr("y2", (d) => 0.5 + y(d))
          .attr("x1", margin.left)
          .attr("x2", width - margin.right)
      );

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  svg.append("g").call(grid);

  svg
    .append("g")
    .attr("stroke-width", 1.5)
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("transform", (d) => `translate(${x(d.ph)},${y(d.phosphates_p)})`)
    .attr("fill", (d) => color(d.region))
    .attr("d", (d) => shape(d.source_type));

  }, [data]);

  return (
    <div>
      <Typography
        margin={"10px"}
        variant="h6"
        color={"red"}
        fontWeight={"600"}
        textAlign={"center"}
      >
        Measure of acidification Vs Measure of salinisation
      </Typography>
      <svg ref={svgRef} width="100%" height="300">
        {/* Add axes and data points */}
      </svg>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 1,
          m: 1,
        }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Box
            width={"20px"}
            height={"20px"}
            backgroundColor={"currentColor"}
          />
          <Typography variant="body2" sx={{ m: 1 }}>
            pH
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <Box
            width={"20px"}
            height={"20px"}
            backgroundColor={"currentColor"}
          />
          <Typography variant="body2" sx={{ m: 1 }}>
            Phosphates
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default ScatterPlot;
