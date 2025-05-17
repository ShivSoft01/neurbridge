import React, { useEffect } from 'react';
import { theme } from '../theme';

const VirtualTeacher: React.FC = () => {
  useEffect(() => {
    // Create and append the HeyGen embed script
    const script = document.createElement('script');
    script.innerHTML = `!function(window){const host="https://labs.heygen.com",url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJLYXR5YV9CbGFja19TdWl0X3B1YmxpYyIs%0D%0AInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3YzL2RhNWNiYTZi%0D%0AYzdiMzRjNWVhMTM5Zjc3ZGE5OGZkYzA0XzU1MzcwL3ByZXZpZXdfdGFsa18xLndlYnAiLCJuZWVk%0D%0AUmVtb3ZlQmFja2dyb3VuZCI6dHJ1ZSwia25vd2xlZGdlQmFzZUlkIjoiZDNhZGYyMzdlM2U5NDNi%0D%0ANTg3M2YzOGE5ZmU5ODExYjUiLCJ1c2VybmFtZSI6ImU4OTA1YjY2YjA3NDQzM2RhOTdkNWQxMzIw%0D%0AOGI0MjdjIn0%3D&inIFrame=1",clientWidth=document.body.clientWidth,wrapDiv=document.createElement("div");wrapDiv.id="heygen-streaming-embed";const container=document.createElement("div");container.id="heygen-streaming-container";const stylesheet=document.createElement("style");stylesheet.innerHTML=\`\n  #heygen-streaming-embed {\n    z-index: 9999;\n    position: fixed;\n    left: 40px;\n    bottom: 40px;\n    width: 200px;\n    height: 200px;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);\n    transition: all linear 0.1s;\n    overflow: hidden;\n\n    opacity: 0;\n    visibility: hidden;\n  }\n  #heygen-streaming-embed.show {\n    opacity: 1;\n    visibility: visible;\n  }\n  #heygen-streaming-embed.expand {\n    \${clientWidth<540?"height: 266px; width: 96%; left: 50%; transform: translateX(-50%);":"height: 366px; width: calc(366px * 16 / 9);"}\n    border: 0;\n    border-radius: 8px;\n  }\n  #heygen-streaming-container {\n    width: 100%;\n    height: 100%;\n  }\n  #heygen-streaming-container iframe {\n    width: 100%;\n    height: 100%;\n    border: 0;\n  }\n  \`;const iframe=document.createElement("iframe");iframe.allowFullscreen=!1,iframe.title="Streaming Embed",iframe.role="dialog",iframe.allow="microphone",iframe.src=url;let visible=!1,initial=!1;window.addEventListener("message",(e=>{e.origin===host&&e.data&&e.data.type&&"streaming-embed"===e.data.type&&("init"===e.data.action?(initial=!0,wrapDiv.classList.toggle("show",initial)):"show"===e.data.action?(visible=!0,wrapDiv.classList.toggle("expand",visible)):"hide"===e.data.action&&(visible=!1,wrapDiv.classList.toggle("expand",visible)))})),container.appendChild(iframe),wrapDiv.appendChild(stylesheet),wrapDiv.appendChild(container),document.body.appendChild(wrapDiv)}(globalThis);`;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const embed = document.getElementById('heygen-streaming-embed');
      if (embed) {
        document.body.removeChild(embed);
      }
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8" style={{ backgroundColor: theme.primary }}>
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: theme.text }}>
          Chat with Virtual Teacher
        </h1>
        <div className="bg-white rounded-lg p-6 shadow-lg" style={{ border: `2px solid ${theme.secondary}` }}>
          <p className="text-lg mb-4 text-center" style={{ color: theme.text }}>
            Your virtual teacher is ready to help you with your studies. Click the chat button in the bottom left corner to start a conversation!
          </p>
          <div className="flex justify-center items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <span className="text-3xl">👩‍🏫</span>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-semibold" style={{ color: theme.text }}>
                Ms. Katya
              </h2>
              <p className="text-gray-600">Your Virtual Teacher</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTeacher; 