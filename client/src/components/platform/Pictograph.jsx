import React from "react";
import { PieChart, Pie } from "recharts";
import raang from "./Colors";

const Pictograph = ({ fdata }) => {
  // Sample data
  const data1 = fdata.tags;
  const color = raang.reverse();

  const data2 = [],
    data3 = [];
  let total = 0;
  for (let key in data1) {
    let person = data1[key];

    data2.push({ name: key, students: person });
    total = total + person;
  }
  data2.sort(function (a, b) {
    return a.students - b.students;
  });
  data2.reverse();
  console.log(data2);
  let x = 0;
  let v = 0;
  let c = -1;
  data2.forEach((data) => {
    v = v + data.students;
    if (v > (total * 95) / 100) {
      if (c == -1) {
        v = v - data.students;
        data3.push({ name: "others", students: total - v });
        c = 0;
      }
    } else {
      data3.push(data);
      data3[x].fill = `${color[x]}`;
    }

    x++;
  });

  return (
    <PieChart width={700} height={700}>
      <Pie
        data={data3}
        dataKey="students"
        outerRadius={200}
        innerRadius={100}
        fill="black"
      />

      {data3.map((s) => (
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={s.data}
          cx={200}
          cy={200}
          outerRadius={100}
          innerRadius={100}
          fill={s.color}
          key={name}
        />
      ))}
    </PieChart>
  );
};

export default Pictograph;
