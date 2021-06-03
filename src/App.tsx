import React, { FunctionComponent, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  Hint,
  FlexibleXYPlot,
  MarkSeries,
  Crosshair,
  DiscreteColorLegend,
} from "react-vis";
import "../node_modules/react-vis/dist/style.css";

interface iPoint {
  x: number;
  y: number;
}

const colors = [
  "#ffc53d",
  "#ffec3d",
  "#bae637",
  "#52c41a",
  "#13c2c2",
  "#1890ff",
  "#597ef7",
  "#722ed1",
  "#eb2f96",
  "#ffd591",
  "#ff7a45",
  "#ff4d4f",
];

const App: FunctionComponent = () => {
  const [dataSum, setDataSum] = useState<iPoint[]>([]);

  const [bath, setBath] = useState<iPoint[]>([]);
  const [ceiling, setCeiling] = useState<iPoint[]>([]);

  const [el, setEl] = useState<iPoint[]>([]);
  const [nedTagningVæg, setNedTagningVæg] = useState<iPoint[]>([]);
  const [kitchen, setKitchen] = useState<iPoint[]>([]);
  const [kitchenStuff, setKitchenStuff] = useState<iPoint[]>([]);
  const [blandingsBateri, setBlandingsBateri] = useState<iPoint[]>([]);
  const [altan, setAltan] = useState<iPoint[]>([]);
  const [wall, setWall] = useState<iPoint[]>([]);
  const [workerPay, setWorkerPay] = useState<iPoint[]>([]);

  const [crosshairValues, setCrosshairValues] = useState<iPoint[]>([]);

  useEffect(() => {
    var min_year = 2011;
    var max_year = 2050;
    var priceObj: any = {};

    //Nyt badeværelse 2011 - 20 år - pris 128188
    var bath = [];
    for (var i = min_year; i <= max_year; i++) {
      var val = Math.round(formular_20_years(i - min_year) * 0.01 * 128188);
      priceObj[i] = val;
      bath.push({
        x: i,
        y: val,
      });
    }
    setBath(bath);

    //Renovering af lofter 2011
    var ceiling = [];
    for (var i = min_year; i <= max_year; i++) {
      var val = Math.round(formular_30_years(i - min_year) * 0.01 * 8134);
      priceObj[i] += val;
      ceiling.push({
        x: i,
        y: val,
      });
    }
    setCeiling(ceiling);

    //El-arbejde + Tavle
    var el = [];
    for (var i = 2011; i <= max_year; i++) {
      var val = Math.round(formular_20_years(i - 2011) * 0.01 * 4065);
      priceObj[i] += val;
      el.push({
        x: i,
        y: val,
      });
    }
    setEl(el);

    //nedvæg
    var ned = [];
    for (var i = 2012; i <= max_year; i++) {
      var val = Math.round(formular_20_years(i - 2012) * 0.01 * 15000);
      priceObj[i] += val;
      ned.push({
        x: i,
        y: val,
      });
    }
    setNedTagningVæg(ned);

    // const [kitchen, setKitchen] = useState<iPoint[]>([]);
    var kit = [];
    for (var i = 2012; i <= max_year; i++) {
      var val = Math.round(formular_20_years(i - 2012) * 0.01 * 92504.5);
      priceObj[i] += val;
      kit.push({
        x: i,
        y: val,
      });
    }
    setKitchen(kit);

    // const [kitchenStuff, setKitchenStuff] = useState<iPoint[]>([]);
    var kitStuf = [];
    for (var i = 2012; i <= max_year; i++) {
      var val = Math.round(formular_20_years(i - 2012) * 0.01 * 8800);
      priceObj[i] += val;
      kitStuf.push({
        x: i,
        y: val,
      });
    }
    setKitchenStuff(ned);

    // const [blandingsBateri, setBlandingsBateri] = useState<iPoint[]>([]);
    var blan = [];
    for (var i = 2012; i <= max_year; i++) {
      var val = Math.round(formular_10_years(i - 2012) * 0.01 * 799);
      priceObj[i] += val;
      blan.push({
        x: i,
        y: val,
      });
    }
    setBlandingsBateri(ned);

    // const [altan, setAltan] = useState<iPoint[]>([]);
    var alt = [];
    for (var i = 2015; i <= max_year; i++) {
      var val = Math.round(formular_30_years(i - 2015) * 0.01 * 102626);
      priceObj[i] += val;
      alt.push({
        x: i,
        y: val,
      });
    }
    setAltan(alt);

    // const [wall, setWall] = useState<iPoint[]>([]);
    var wal = [];
    for (var i = 2020; i <= max_year; i++) {
      var val = Math.round(formular_30_years(i - 2020) * 0.01 * 2382);
      priceObj[i] += val;
      wal.push({
        x: i,
        y: val,
      });
    }
    setWall(wal);
    // const [workerPay, setWorkerPay] = useState<iPoint[]>([]);
    var work = [];
    for (var i = 2020; i <= max_year; i++) {
      var val = Math.round(formular_30_years(i - 2020) * 0.01 * 2004);
      priceObj[i] += val;
      work.push({
        x: i,
        y: val,
      });
    }
    setWorkerPay(work);

    //Make plot numbers
    var data: iPoint[] = [];
    Object.entries(priceObj).forEach(([key, value]) => {
      data.push({
        x: +key,
        y: value as number,
      });
    });
    setDataSum(data);
  }, []);

  const god_formular: (
    year: number,
    break_year: number,
    pro_at_break: number,
    runningtime: number
  ) => number = (year, break_year, pro_at_break, runningtime) => {
    if (year <= break_year) {
      return 100 - year * (pro_at_break / break_year);
    }
    if (year <= runningtime) {
      return (
        god_formular(break_year, break_year, pro_at_break, runningtime) -
        (year - break_year) *
          ((100 - pro_at_break - 10) / (runningtime - break_year))
      );
    } else {
      return 10;
    }
  };

  const formular_30_years: (year: number) => number = (year) => {
    return god_formular(year, 7, 5, 30);
  };

  const formular_20_years: (year: number) => number = (year) => {
    return god_formular(year, 5, 10, 20);
  };

  const formular_10_years: (year: number) => number = (year) => {
    return god_formular(year, 2, 10, 10);
  };

  const onNearestX = (value: number, index: number) => {
    var points = [];
    points.push(bath[index]);
    points.push(ceiling[index]);
    points.push(el[index]);
    points.push(nedTagningVæg[index]);
    points.push(kitchen[index]);
    points.push(kitchenStuff[index]);
    points.push(blandingsBateri[index]);
    points.push(altan[index]);
    points.push(wall[index]);
    points.push(workerPay[index]);

    points.push(dataSum[index]);

    // const [el, setEl] = useState<iPoint[]>([]);
    // const [nedTagningVæg, setNedTagningVæg] = useState<iPoint[]>([]);
    // const [kitchen, setKitchen] = useState<iPoint[]>([]);
    // const [kitchenStuff, setKitchenStuff] = useState<iPoint[]>([]);
    // const [blandingsBateri, setBlandingsBateri] = useState<iPoint[]>([]);
    // const [altan, setAltan] = useState<iPoint[]>([]);
    // const [wall, setWall] = useState<iPoint[]>([]);
    // const [workerPay, setWorkerPay] = useState<iPoint[]>([]);

    setCrosshairValues(points);
  };

  return (
    <div className="App">
      <br></br>
      <br></br>
      <br></br>
      <div style={{ width: "80%", height: "600px", margin: "auto" }}>
        <FlexibleXYPlot margin={{ left: 100 }}>
          <MarkSeries data={[{ x: 2011, y: 0 }]} style={{ display: "none" }} />
          <LineSeries
            data={bath}
            onNearestX={(val, cur) => onNearestX(val.x, cur.index)}
            color={colors[0]}
          />
          <LineSeries data={ceiling} color={colors[1]} />
          <LineSeries data={el} color={colors[2]} />
          <LineSeries data={nedTagningVæg} color={colors[3]} />
          <LineSeries data={kitchen} color={colors[4]} />
          <LineSeries data={kitchenStuff} color={colors[5]} />
          <LineSeries data={blandingsBateri} color={colors[6]} />
          <LineSeries data={altan} color={colors[7]} />
          <LineSeries data={wall} color={colors[8]} />
          <LineSeries data={workerPay} color={colors[9]} />

          <LineSeries data={dataSum} color={colors[10]} />

          <DiscreteColorLegend
            items={[
              {
                title: "Badeværelse 2011",
                color: colors[0],
              },
              {
                title: "Renovering af loft 2011",
                color: colors[1],
              },
              {
                title: "El-arbejde + Tavle 2011",
                color: colors[2],
              },
              {
                title: "Nedtagning af væg 2012",
                color: colors[3],
              },
              {
                title: "Nyt køkken inkl Loft 2012",
                color: colors[4],
              },
              {
                title: "Emhætte, kogeplade, opvaskemaskine 2012",
                color: colors[5],
              },
              {
                title: "Blandingsbatteri 2012",
                color: colors[6],
              },
              {
                title: "Altan 2015",
                color: colors[7],
              },
              {
                title: "Væg 2020 ",
                color: colors[8],
              },
              {
                title: "Arbejdsløn 2020",
                color: colors[9],
              },
              {
                title: "Sum",
                color: colors[10],
              },
            ]}
          />
          <XAxis
            tickFormat={(d) => {
              return d + "";
            }}
          />
          <YAxis
            tickFormat={(d) => {
              return d + "";
            }}
          />
          <Crosshair values={crosshairValues} />
        </FlexibleXYPlot>
      </div>
    </div>
  );
};

export default App;
