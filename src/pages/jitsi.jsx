import React, { useState,useEffect } from "react";

// import config from "../js/interface_config_jitsi";
import { generateJwt } from '../utils/api';

const VideoConference = ({ roomName }) => {

  const jitsiContainerId = "jitsi-container-id";
  const [jitsi, setJitsi] = useState({});
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    let values = {};
    values.roomName = roomName;
    if (roomName) {
      generateJwt(values)
        .then((resp) => {
          setJwtToken(resp);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [roomName]);
  const loadJitsiScript = () => {
    let resolveLoadJitsiScriptPromise = null;

    const loadJitsiScriptPromise = new Promise((resolve) => {
      resolveLoadJitsiScriptPromise = resolve;
    });

    const script = document.createElement("script");
    script.src = "https://meet.telepuja.com/external_api.js";
    script.async = true;
    script.onload = () => resolveLoadJitsiScriptPromise(true);
    document.body.appendChild(script);

    return loadJitsiScriptPromise;
  };

  const initialiseJitsi = async () => {
    if (!window.JitsiMeetExternalAPI) {
      await loadJitsiScript();
    }
    const _jitsi = new window.JitsiMeetExternalAPI(`meet.telepuja.com`, {
      parentNode: document.getElementById(jitsiContainerId),
      roomName:roomName +`?jwt=${jwtToken}`
    });

    setJitsi(_jitsi);
  };

  useEffect(() => {
    if(jwtToken){
      initialiseJitsi();
      return () => {
        jitsi?.dispose?.();
      };
    } 
  }, [jwtToken]);

  return <div id={jitsiContainerId} style={{ height: 400, width: "100%" }} />;
};


export default VideoConference;
