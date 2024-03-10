import React, { useState } from "react";
import { BrowserRouter, Route, Link, Router, Routes } from "react-router-dom";
import Me from "./pages/Profile/Profile";
import Header from "./components/Header/Header";
import Codeforces from "./components/platform/Codeforces";
import Github from "./components/platform/Github";
import Leetcode from "./components/platform/Leetcode";
import Home from "./pages/Home/Home";
import Codechef from "./components/platform/Codechef";

import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Geeksforgeeks from "./components/platform/Geeksforgeeks";
import Social from "./pages/Social/Social";
import Discussion from "./pages/Discussion/Discussion";
import AdminChat from "./pages/AdminChat/AdminChat";
import DiscussionChat from "./pages/DiscussionChat/DiscussionChat";
import Error from "./pages/Error/Error";
import Reports from "./pages/Reports/Reports";
import Registration from "./pages/Registration/Registration";

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter> */}
      <Header />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="discussion" element={<Discussion />} />
        <Route path="discussion/:slug" element={<DiscussionChat />} />
        <Route path="admin-chats" element={<AdminChat />} />
        <Route path="view-reports" element={<Reports />} />
        <Route path="chat" element={<Chat />} />
        <Route path="login" element={<Login />} />
        <Route path="social" element={<Social />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="registration" element={<Registration />} />
        <Route path="profile/:slug" element={<Me />}>
          <Route path="codeforces" element={<Codeforces />} />
          <Route path="codechef" element={<Codechef />} />
          <Route path="leetcode" element={<Leetcode />} />
          <Route path="github" element={<Github />} />
          <Route path="geeksforgeeks" element={<Geeksforgeeks />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
