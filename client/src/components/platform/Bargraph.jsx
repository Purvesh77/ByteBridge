import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const Bargraph = ({ fdata }) => {
  // Sample data
  const data1 = fdata.problemStats;

  const data = [
    { name: "800", new: fdata.problemStats["800"] },
    { name: "900", new: fdata.problemStats["900"] },
    { name: "1000", new: fdata.problemStats["1000"] },
    { name: "1100", new: fdata.problemStats["1100"] },
    { name: "1200", pup: fdata.problemStats["1200"] },
    { name: "1300", pup: fdata.problemStats["1300"] },
    { name: "1400", spe: fdata.problemStats["1400"] },
    { name: "1500", spe: fdata.problemStats["1500"] },
    { name: "1600", exp: fdata.problemStats["1600"] },
    { name: "1700", exp: fdata.problemStats["1700"] },
    { name: "1800", exp: fdata.problemStats["1800"] },
    { name: "1900", cm: fdata.problemStats["1900"] },
    { name: "2000", cm: fdata.problemStats["2000"] },
    { name: "2100", m: fdata.problemStats["2100"] },
    { name: "2200", m: fdata.problemStats["2200"] },
    { name: "2300", im: fdata.problemStats["2300"] },
    { name: "2400", gm: fdata.problemStats["2400"] },
    { name: "2500", gm: fdata.problemStats["2500"] },
    { name: "2600", igm: fdata.problemStats["2600"] },
    { name: "2700", igm: fdata.problemStats["2700"] },
    { name: "2800", igm: fdata.problemStats["2800"] },
    { name: "2900", igm: fdata.problemStats["2900"] },
    { name: "3000", lgm: fdata.problemStats["3000"] },
    { name: "3100", lgm: fdata.problemStats["3100"] },
    { name: "3200", lgm: fdata.problemStats["3200"] },
    { name: "3300", lgm: fdata.problemStats["3300"] },
    { name: "3400", lgm: fdata.problemStats["3400"] },
    { name: "3500", lgm: fdata.problemStats["3500"] },
  ];

  const handleBarHover = (e, item) => {
    this.setState({ hoveredBar: item });
  };

  return (
    <BarChart width={500} height={500} data={data}>
      <CartesianGrid />
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="new" stackId="a" fill="#c5c3bf" />
      <Bar dataKey="pup" stackId="a" fill="#56f270" />
      <Bar dataKey="spe" stackId="a" fill="#57f2b3" />
      <Bar dataKey="exp" stackId="a" fill="#55a4f4" />
      <Bar dataKey="cm" stackId="a" fill="#f175ff" />
      <Bar dataKey="m" stackId="a" fill="#ffc363" />
      <Bar dataKey="im" stackId="a" fill="#ff9e01" />
      <Bar dataKey="gm" stackId="a" fill="#fd9292" />
      <Bar dataKey="igm" stackId="a" fill="#ff5454" />
      <Bar dataKey="lgm" stackId="a" fill="#b30000" />
    </BarChart>
  );
};

export default Bargraph;
