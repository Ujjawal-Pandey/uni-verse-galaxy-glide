import { useEffect } from 'react';

const ChatbaseScript = () => {
  useEffect(() => {
    console.log('Initializing Chatbase script...');
    const script = document.createElement('script');
    script.innerHTML = `
      (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="qtYP-7b-3xlE716ACOxiw";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
    `;
    document.body.appendChild(script);
    console.log('Chatbase script injected');

    return () => {
      document.body.removeChild(script);
      console.log('Chatbase script removed');
    };
  }, []);

  return null;
};

export default ChatbaseScript; 