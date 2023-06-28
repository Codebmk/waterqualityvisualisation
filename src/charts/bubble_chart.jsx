import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Typography } from "@mui/material";

const BubbleChart = ({ data }) => {
  const format = d3.format(".0f");
  let tree = [];

  // Extract the number of water sources for each district
  data.forEach((row) => {
    tree.push({ district: row[0], value: row[1] });
  });

  // Chart dimensions
  const width = 500;
  const height = 400;

  const margin = 12;

  const svg = d3
    .select("#d3_bubble")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "max-w-full max-h-full");

  // Create a categorical color scale.
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  // Create the pack layout.
  const pack = d3
    .pack()
    .size([width - margin * 1, height - margin * 1])
    .padding(3);

  // Compute the hierarchy from the (flat) data; expose the values
  // for each node; lastly apply the pack layout.
  const root = pack(d3.hierarchy({ children: tree }).sum((d) => d.value));

  // Place each (leaf) node according to the layout’s x and y values.
  const node = svg
    .selectAll("g.node")
    .data(root.leaves())
    .join("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  function update(newData) {
    // Remove existing chart elements
    svg.selectAll("g.node").remove();

    // Extract the number of water sources for each district
    const updatedTree = newData.map((row) => ({
      district: row[0],
      value: row[1],
    }));

    // Compute the hierarchy from the (flat) data; expose the values
    // for each node; lastly apply the pack layout.
    const updatedRoot = pack(
      d3.hierarchy({ children: updatedTree }).sum((d) => d.value)
    );

    // Place each (leaf) node according to the layout’s x and y values.
    const updatedNode = svg
      .selectAll("g.node")
      .data(updatedRoot.leaves())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Add a title.
    updatedNode
      .append("title")
      .text((d) => `${d.data.district}\n${format(d.value)}`);

    // Add a filled circle.
    updatedNode
      .append("circle")
      .attr("fill-opacity", 0.7)
      .attr("fill", (d) => color(d.data.district))
      .attr("r", (d) => d.r);

    // Add a label.
    const updatedText = updatedNode
      .append("text")
      .attr("clip-path", (d) => `circle(${d.r})`);

    // Add text within the bubbles
    updatedText
      .append("tspan")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "12px")
      .text((d) => `${d.data.district}`);

    updatedText
      .append("tspan")
      .attr("style", "font-weight: bolder;")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", "10px")
      .attr("x", 0)
      .attr("dy", "1em")
      .text((d) => `${format(d.data.value)}`);
  }

  useEffect(() => {
    if (data.length > 0) {
      // Add a title.
      node
        .append("title")
        .text((d) => `${d.data.district}\n${format(d.value)}`);

      // Add a filled circle.
      node
        .append("circle")
        .attr("fill-opacity", 0.7)
        .attr("fill", (d) => color(d.data.district))
        .attr("r", (d) => d.r);

      // Add a label.
      const text = node
        .append("text")
        .attr("clip-path", (d) => `circle(${d.r})`);

      // Add text within the bubbles
      text
        .append("tspan")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "14px")
        .text((d) => `${d.data.district}`);

      text
        .append("tspan")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "10px")
        .attr("style", "font-weight: bolder;")
        .attr("x", 0)
        .attr("dy", "1em")
        .text((d) => format(d.data.value));

      update(data);
    }
  }, [data]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography
        margin={"10px"}
        variant="h6"
        color={"red"}
        fontWeight={"600"}
        textAlign={"center"}
      >
        Measure of salinisation of water bodies by region
      </Typography>
      <svg id="d3_bubble" width="100%" height="400">
        {/* Add axes and bars */}
      </svg>
    </Box>
  );
};

export default BubbleChart;
