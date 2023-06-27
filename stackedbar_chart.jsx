import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Typography } from '@mui/material';

const StackedBarChart = ({data}) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {

   // set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 20, left: 50},
width = 1200,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select(chartContainerRef.current)
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

const subgroups = ["ammonium_n","nitrates_n", "nitrites"];

// List of groups = species here = value of the first column called group -> I show them on the X axis
const groups = data.map(d => (d.district))

// Add X axis
const x = d3.scaleBand()
  .domain(groups)
  .range([0, width])
  .padding([0.2])
svg.append("g")
.attr("transform", `translate(0, ${height})`)
.call(d3.axisBottom(x).tickSizeOuter(0));

// Add Y axis
const y = d3.scaleLinear()
.domain([0, 60])
.range([ height, 0 ]);
svg.append("g")
.call(d3.axisLeft(y));

// color palette = one color per subgroup
const color = d3.scaleOrdinal()
.domain(subgroups)
.range(['#e41a1c','#377eb8','#4daf4a'])

//stack the data? --> stack per subgroup
const stackedData = d3.stack()
.keys(subgroups)
(data)

// Show the bars
svg.append("g")
.selectAll("g")
// Enter in the stack data = loop key per key = group per group
.data(stackedData)
.join("g")
  .attr("fill", d => color(d.key))
  .selectAll("rect")
  // enter a second time = loop subgroup per subgroup to add all rectangles
  .data(d => d)
  .join("rect")
    .attr("x", d => x(d.data.district))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width",x.bandwidth())
  }, [data]);

  
  return (
    <div>
      <svg
        ref={chartContainerRef}
        id="stackedbar_chart"
        width="100%"
        height="400"
      ></svg>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent:"center", p: 1, m: 1 }}>
        <Box display={"flex"} alignItems={"center"}>
          <Box width={"20px"} height={"20px"} backgroundColor={"#e41a1c"} />
          <Typography variant="body2" sx={{ m: 1 }}>
            Ammonium
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <Box width={"20px"} height={"20px"} backgroundColor={"#377eb8"} />
          <Typography variant="body2" sx={{ m: 1 }}>
            Nitrates
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <Box width={"20px"} height={"20px"} backgroundColor={"#4daf4a"} />
          <Typography variant="body2" sx={{ m: 1 }}>
            Nitrites
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default StackedBarChart;
