import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footers from "../components/footers";
import { serverURL } from "../constants";
import axios from "axios";
// import StyledText from "../components/styledText";

const PrivacyPolicy = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      const postURL = `${serverURL}/api/policies`;
      try {
        const response = await axios.get(postURL);
        console.log(response.data.privacy);
        const privacyPolicy = response.data.privacy;
        setData(privacyPolicy);
        sessionStorage.setItem("PrivacyPolicy", privacyPolicy); // Store in sessionStorage
      } catch (err) {
        setError("Failed to load privacy policy. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionStorage.getItem("PrivacyPolicy")) {
      setData(sessionStorage.getItem("PrivacyPolicy"));
      setLoading(false); // No need to load if already in sessionStorage
    } else {
      fetchPrivacyPolicy();
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={false} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        <div className="flex-1 flex items-center justify-center py-10 flex-col">
          <p className="text-center font-black text-4xl text-black dark:text-white">
            Privacy Policy
          </p>
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="w-2/4 py-10 text-justify text-black dark:text-white">
              <div dangerouslySetInnerHTML={{ __html: data }} />
            </div>
          )}
        </div>
      </div>
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default PrivacyPolicy;
