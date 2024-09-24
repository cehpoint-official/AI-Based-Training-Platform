import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footers from "../components/footers";
import { serverURL } from "../constants";
import axios from "axios";
import StyledText from "../components/styledText";

const TermsPolicy = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const postURL = `${serverURL}/api/termsOfUs`;
      try {
        const response = await axios.get(postURL);
        if (response.data && response.data.terms) {
          const terms = response.data.terms || "No terms available";
          setData(terms);
          sessionStorage.setItem("TermsPolicy", terms); // Store in sessionStorage
        } else {
          throw new Error("No terms data found");
        }
      } catch (err) {
        setError("Failed to load terms policy. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionStorage.getItem("TermsPolicy")) {
      setData(sessionStorage.getItem("TermsPolicy"));
      setLoading(false); // No need to load if already in sessionStorage
    } else {
      fetchData();
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header isHome={false} className="sticky top-0 z-50" />
      <div className="dark:bg-black flex-1">
        <div className="flex-1 flex items-center justify-center py-10 flex-col">
          <p className="text-center font-black text-4xl text-black dark:text-white">
            Terms
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

export default TermsPolicy;
