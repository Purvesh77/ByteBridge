import React, { useEffect, useState } from "react";
import axios from "axios";
import { PacmanLoader } from "react-spinners";
import { useOutletContext } from "react-router-dom";

const Leetcode = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [codeforcesHandle, codechefHandle, leetcodeHandle, githubHandle] =
    useOutletContext();

  useEffect(() => {
    const getdata = async () => {
      try {
        const handle = leetcodeHandle.current;
        console.log("----------------------");
        console.log(handle);
        console.log("----------------------");
        const fdata = await axios.get(
          `https://codenova-webscrapping.onrender.com/api/v1/leetcode/${handle}`
        );
        setData(fdata.data);

        console.log(fdata.data);
      } catch (error) {
        console.log(error);
        alert("user not found");
        setLoading(false);
        setError(true);
        setData(null);
      }
    };
    getdata();
  }, []);

  return (
    <div>
      Leetcode
      {data ? (
        " data arrived"
      ) : !error ? (
        <PacmanLoader color="#ffac2b" />
      ) : (
        " error occoured"
      )}
    </div>
  );
};

export default Leetcode;
