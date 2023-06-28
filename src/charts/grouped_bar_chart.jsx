import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box, Typography } from "@mui/material";

const GroupedBarChart = ({ data }) => {
  const d3_grouped_bar_chart_ref = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Chart dimensions
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = parseInt(
        d3.select(d3_grouped_bar_chart_ref.current).style("width"),
        10
      );
      const height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select(d3_grouped_bar_chart_ref.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      // Prepare the scales for positional and color encodings.
      // Fx encodes the state.
      const fx = d3
        .scaleBand()
        .domain(new Set(data.map((d) => d.district)))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.1);

      // Both x and color encode the age class.
      const sourceType = new Set(data.map((d) => d.source_type));

      const x = d3
        .scaleBand()
        .domain(sourceType)
        .rangeRound([0, fx.bandwidth()])
        .padding(0.05);

      const color = d3
        .scaleOrdinal()
        .domain(sourceType)
        .range(d3.schemeSpectral[sourceType.size])
        .unknown("#ccc");

      // Y encodes the height of the bar.
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.electrical_conductivity)])
        .nice()
        .rangeRound([height - margin.bottom, margin.top]);

      // Append a group for each state, and a rect for each age.
      svg
        .append("g")
        .selectAll()
        .data(d3.group(data, (d) => d.district))
        .join("g")
        .attr("transform", ([district]) => `translate(${fx(district)},0)`)
        .selectAll()
        .data(([, d]) => d)
        .join("rect")
        .attr("x", (d) => x(d.source_type))
        .attr("y", (d) => y(d.electrical_conductivity))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(0) - y(d.electrical_conductivity))
        .attr("fill", (d) => color(d.source_type));

      // Append the horizontal axis.
      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(fx).tickSizeOuter(0))
        .call((g) => g.selectAll(".domain").remove())
        .selectAll("text")
        .attr("x", 0)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("text-anchor", "center")
        .call((g) =>
          g
            .append("text")
            .attr("x", -margin.left)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .text("Districts")
        );

      // Append the vertical axis.
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call((g) => g.selectAll(".domain").remove());
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
        Measure of salinisation depending on source type within districts
      </Typography>
      <svg ref={d3_grouped_bar_chart_ref} width="95%" height="400"></svg>
    </Box>
  );
};

export default GroupedBarChart;
