import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportCard from "../../components/ReportCard/ReportCard";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const pageLoad = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      const { data } = await axios.get(
        `https://codenova-api.onrender.com/api/v1/admin/all-reports`,
        config
      );

      //   console.log(data);
      setReports(data.report);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    pageLoad();
  }, []);
  return (
    <div>
      {reports
        ? reports.map((item) => <ReportCard key={item._id} item={item} />)
        : "Loading.."}
    </div>
  );
};

export default Reports;
