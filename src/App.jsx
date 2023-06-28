import { useState, useEffect } from "react";
import * as d3 from "d3";
import {
  Typography,
  AppBar,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import BarPlot from "./charts/barplot";
import LollipopBarChart from "./charts/lollipop_plot";
import ChoroplethMap from "./charts/map";
import { transformDataToGeoJson } from "./charts/utils";
import PieChart from "./charts/pie_plot";
import BarChart from "./charts/bar_chart";
import StackedBarChart from "../stackedbar_chart";
import DonutChart from "./charts/donut";
import GroupedBarChart from "./charts/grouped_bar_chart";
import BubbleChart from "./charts/bubble_chart";

export default function App() {
  const [data, setData] = useState([]);
  const [geoJsonData, seGeoJsonData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    d3.json(
      "https://gist.githubusercontent.com/matovu-ronald/2b758d28a413cab77feea61ef846289c/raw/2497a654c003c10765bd9e23be8f10652cb65aa6/water_quality_dataset.json"
    )
      .then((data) => {
        setData(data);
        setLoading(false);

        const payload = transformDataToGeoJson(
          data,
          {
            longitude: "Longitude",
            latitude: "Latitude",
          },
          (feature) => [
            feature && feature.longitude,
            feature && feature.latitude,
          ]
        );

        seGeoJsonData(payload);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const getWaterSources = (data) => {
    const waterSourceTypes = data.map((d) => d["source_type"]);
    const uniqueWaterSourceTypes = [...new Set(waterSourceTypes)];
    return uniqueWaterSourceTypes;
  };

  const dataGroupedByDistrict = (data) =>
    d3.rollups(
      data,
      (v) => d3.mean(v, (d) => d.electrical_conductivity),
      (d) => d.district
    );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <AppBar
        position="static"
        color="primary"
        style={{ marginBottom: "20px", padding: "8px" }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "block" },
            height: "40px",
          }}
        >
          Water quality in Uganda
        </Typography>
      </AppBar>

      {loading && (
        <Typography variant="body1" textAlign={"center"}>
          Loading charts...
        </Typography>
      )}

      {data && (
        <>
          <Grid container spacing={2} padding={"24px"} position={"relative"}>
            <Grid item lg={4} sm={12} xl={6} xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="body1">
                    Total monitoring sites
                  </Typography>
                  <Typography variant="body2">{data.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={5} sm={12} xl={6} xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="body1">Water source types</Typography>
                  <Box display={"flex"}>
                    {getWaterSources(data).map((d, i) => (
                      <Typography variant="body2" key={i} marginRight={"10px"}>
                        {d}
                        {i !== getWaterSources(data).length - 1 && ","}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container>
            <Grid container lg={12} sm={12} xl={2} xs={12}>
              <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                <Paper
                  elevation={3}
                  style={{
                    margin: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <DonutChart data={data} />
                </Paper>
              </Grid>
              <Grid
                item
                lg={12}
                xs={12}
                sm={12}
                md={12}
                xl={12}
                position={"relative"}
              >
                <Paper
                  elevation={3}
                  style={{
                    margin: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <BubbleChart data={dataGroupedByDistrict(data)} />
                </Paper>
              </Grid>
              <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                <Paper elevation={3} style={{ margin: "10px" }}>
                  <BarPlot data={data} />
                </Paper>
              </Grid>
              <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                <Paper elevation={3} style={{ margin: "10px" }}>
                  <LollipopBarChart data={data} />
                </Paper>
              </Grid>
              <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                <Paper elevation={3} style={{ margin: "10px" }}>
                  <GroupedBarChart data={data} />
                </Paper>
              </Grid>
              <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                <Paper
                  elevation={3}
                  style={{
                    margin: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <PieChart data={data} />
                </Paper>
              </Grid>
              <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                <Paper elevation={3} style={{ margin: "10px" }}>
                  <Typography
                    margin={"10px"}
                    variant="h6"
                    color={"red"}
                    fontWeight={"600"}
                    textAlign={"center"}
                  >
                    Measure of Nutrient pollution in water bodies by district
                  </Typography>
                  <StackedBarChart data={data} />
                </Paper>
              </Grid>
              <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                <Paper elevation={3} style={{ margin: "10px" }}>
                  <BarChart data={data} />
                </Paper>
              </Grid>
            </Grid>
            <Grid item lg={12} sm={12} xl={2} xs={12} position={"relative"}>
              <Typography
                margin={"10px"}
                variant="h6"
                color={"red"}
                fontWeight={"600"}
                textAlign={"center"}
              >
                Uganda Water Quality Map
              </Typography>
              <Paper
                elevation={3}
                style={{ margin: "10px", position: "relative" }}
              >
                <ChoroplethMap sitesData={geoJsonData} />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
