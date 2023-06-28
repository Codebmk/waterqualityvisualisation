import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, Typography } from "@mui/material";

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const width = parseInt(d3.select(chartRef.current).style("width"), 10);
    const height = window.innerHeight / 2;
    const radius = Math.min(width, height) / 2;

    const arc = d3.arc().outerRadius(radius).innerRadius(0);

    const regionData = data.reduce((acc, d) => {
      if (!acc[d.region]) {
        acc[d.region] = {
          region: d.region,
          count: 0,
          total: 0,
        };
      }
      acc[d.region].count++;
      acc[d.region].total += d.ecoli;
      return acc;
    }, {});

    const regionAverages = Object.values(regionData).map((d) => ({
      region: d.region,
      value: d.total / d.count,
    }));

    var pie = d3.pie().value(function (d) {
      return d.value;
    });
    const pieData = pie(regionAverages);

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    let colorsList = [];
    const arcs = svg
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => {
        colorsList.push(colorScale(i));
        return colorScale(i)
      });

      setColors(colorsList);

    arcs.append("title").text((d) => `${d.data.region}: ${d.value.toFixed(2)}`);

    svg
      .selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text((d) => `${d.data.region}:\n${d.value.toFixed(2)}`);
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
      <svg ref={chartRef} width="100%" height="400"></svg>
      <Box display={"flex"}>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Box width={"20px"} height={"20px"} backgroundColor={colors[0]} />
          <Typography variant="body2" sx={{ m: 1 }}>
            Eastern region
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Box width={"20px"} height={"20px"} backgroundColor={colors[1]} />
          <Typography variant="body2" sx={{ m: 1 }}>
            Central region
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Box width={"20px"} height={"20px"} backgroundColor={colors[2]} />
          <Typography variant="body2" sx={{ m: 1 }}>
            Western region
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PieChart;
