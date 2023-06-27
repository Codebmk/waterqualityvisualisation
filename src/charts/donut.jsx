import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';

const DonutChart = ({ data }) => {
    useEffect(() => {
        const groupDataByDistrict = d3.rollups(
            data,
            (v) => d3.mean(v, (d) => d.turbidity),
            (d) => d.district
          );

        // Chart dimensions
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;

  const margin = { top: 20, right: 20, bottom: 30, left: 20 };

  const arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  const pie = d3
    .pie()
    .padAngle(1 / radius)
    .sort(null)
    .value((d) => d[1]);

  const color = d3
    .scaleOrdinal()
    .domain(groupDataByDistrict.map((d) => d[0]))
    .range(
      d3
        .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), groupDataByDistrict.length)
        .reverse()
    );

  const svg = d3
    .select("#d3_donut")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .selectAll()
    .data(pie(groupDataByDistrict))
    .join("path")
    .attr("fill", (d) => color(d.data[0]))
    .attr("d", arc)
    .append("title")
    .text((d) => `${d.data[0]}: ${d.data[1].toFixed(2)}`);

  svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(groupDataByDistrict))
    .join("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .call((text) =>
      text
        .append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text((d) => d.data[0])
    )
    .call((text) =>
      text
        .filter((d) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text((d) => d.data[1].toFixed(2))
    );


    }, [data]);

    return(
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
        <Typography
        variant="h6"
        color={"red"}
        fontWeight={"600"}
        textAlign={"center"}
      >
        Measure of chloride of water bodies by district
      </Typography>
        <div id="d3_donut">
        </div>
        </Box>
    )
};

export default DonutChart;