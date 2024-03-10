import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommend = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [handle, setHandle] = useState("");

  const getdata = async () => {
    try {
      const fdata = await axios.post(`http://127.0.0.1:5000/predict`, {
        handle: handle,
      });
      setData(fdata.data);
      setLoading(false);
      console.log(fdata.data);
    } catch (error) {
      console.log(error);
      alert("user not found");
      setLoading(false);
      setError(true);
      setData(null);
    }
  };
  return (
    <div>
      <input
        type="text"
        value={handle}
        onChange={(e) => {
          setHandle(e.target.value);
        }}
      />
      <button onClick={getdata}>Click</button>
      {/* <p>{data}</p> */}
    </div>
  );
};

export default Recommend;
