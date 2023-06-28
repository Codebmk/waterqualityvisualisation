import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';

const BarChart = ({ data }) => {
  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 55, left: 20 };
    const width = parseInt(d3.select("#d3_barchart").style('width'), 10) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#d3_barchart").attr("viewBox", [0, 0, width, height]);

    const x_scale = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y_scale = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top]);

    let x_axis = d3.axisBottom(x_scale);

    let y_axis = d3.axisLeft(y_scale);

    // Scale the range of the data in the domains
    x_scale.domain(data.map((d) => d.district));
    y_scale.domain([0, d3.max(data, (d) => d.electrical_conductivity)]);

    // append the rectangles for the bar chart
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x_scale(d.district))
      .attr("y", (d) => y_scale(d.electrical_conductivity))
      .attr("width", x_scale.bandwidth())
      .attr(
        "height",
        (d) => height - margin.bottom - y_scale(d.electrical_conductivity)
      )
      .attr("fill", "steelblue");

    // append x axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(x_axis)
      .selectAll("text")
      .style("text-anchor", "center")
      .attr("dx", "0em")
      .attr("dy", "1.15em");

    // add y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(y_axis);
  }, [data]);

  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}alignItems={"center"}>
      <Typography
        variant="h6"
        color={"red"}
        fontWeight={"600"}
        textAlign={"center"}
      >
        Measure of salination of water bodies by district
      </Typography>
      <svg id="d3_barchart" width="95%" height="400"></svg>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Box width={"20px"} height={"20px"} backgroundColor={"steelblue"} />
          <Typography variant="body2" sx={{ m: 1 }}>
          Electrical Conductivity
          </Typography>
        </Box>
    </Box>
  );
};

export default BarChart;

