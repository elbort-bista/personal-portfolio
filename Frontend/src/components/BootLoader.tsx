import React, { useEffect, useState } from "react";

export default function BootLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <>
      <style>{`
        #boot-loader{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:#000;
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:9999;
          color:#00ff9c;
          font-family:monospace;
        }
        .loader-content{text-align:center;}
        .progress-bar{
          width:300px;
          height:6px;
          background:#222;
          margin:20px auto;
          border-radius:5px;
          overflow:hidden;
        }
        .progress{
          width:0;
          height:100%;
          background:#00ff9c;
          animation:loading 3s linear forwards;
        }
        @keyframes loading{
          from{width:0;}
          to{width:100%;}
        }
      `}</style>

      <div id="boot-loader">
        <div className="loader-content">
          <h2>Initializing System...</h2>
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <p>Loading Secure Environment</p>
        </div>
      </div>
    </>
  );
}
