import React, { useEffect, useState } from "react";
import axios from "axios";
import Bargraph from "./Bargraph";
import { PacmanLoader } from "react-spinners";
import Pictograph from "./Pictograph";
import { useOutletContext } from "react-router-dom";
// import Example from "./Example";

const Codeforces = () => {
  const [codeforcesHandle, codechefHandle, leetcodeHandle, githubHandle] =
    useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getdata = async () => {
      try {
        if (!codeforcesHandle.current) {
          throw error("User not found");
        }
        // console.log("-------------------------");
        // console.log(codeforcesHandle.current);
        // console.log("-------------------------");
        const handle = codeforcesHandle.current;
        const fdata = await axios.get(
          `https://codenova-webscrapping.onrender.com/api/v1/codeforces/${handle}`
        );
        setData(fdata.data);
        setLoading(false);
        // console.log(fdata.data);
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
      {loading ? (
        <PacmanLoader color="#ffac2b" />
      ) : (
        <div>
          codeforces
          {data ? (
            <Bargraph fdata={data} />
          ) : !error ? (
            <PacmanLoader color="#ffac2b" />
          ) : (
            " error occoured"
          )}
          {data ? (
            <Pictograph fdata={data} />
          ) : !error ? (
            <PacmanLoader color="#ffac2b" />
          ) : (
            " error occoured"
          )}
        </div>
      )}
      {/* <Example /> */}
    </div>
  );
};

export default Codeforces;
