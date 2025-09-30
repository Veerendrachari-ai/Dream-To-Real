
import React, { useRef, useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai"; 
import './index.css';
import Select from "react-select";
  const ai = new GoogleGenAI({apiKey:"KEY"});


export default function App() {
  const options = [
    { value: "portfolio", label: "Portfolio Website" },
    { value: "ecommerce", label: "E-commerce Website" },
    { value: "blog", label: "Blog Website" },
    { value: "landingpage", label: "Landing Page" },
    { value: "dashboard", label: "Admin Dashboard" },
    { value: "socialmedia", label: "Social Media Platform" },
    { value: "saas", label: "SaaS Application" },
    { value: "calculator", label: "Calculator" },
    { value: "todo", label: "To-Do App" },
    { value: "chatapp", label: "Chat Application" },
    { value: "weatherapp", label: "Weather App" },
    { value: "restaurant", label: "Restaurant Website" },
    { value: "travelbooking", label: "Travel Booking Site" },
    { value: "education", label: "Education/Online Course" },
    { value: "musicplayer", label: "Music Player" },
    { value: "videoapp", label: "Video Streaming App" },
  ];

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawingData, setDrawingData] = useState();
  const [response, setResponse] = useState(""); 
  const [selectOption, setSelectOption] = useState(options[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 400;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const handleSend = () => {
    const canvas = canvasRef.current;
    const imageData = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);
    const jsonData = {
      width: canvas.width,
      height: canvas.height,
      pixels: Array.from(imageData.data),
    };
    console.log("Drawing JSON:", jsonData);
    setDrawingData(jsonData);
  };

  const handleAnalyze = async () => {
    if (!drawingData) return alert("Please capture JSON first!");
    setLoading(true);
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert front-end engineer and UX designer. 
INPUT: Here is a drawing represented as JSON (either stroke arrays of {x,y}
 points or a full pixel RGBA array):${drawingData} 
 create a website using html css js in single page as json points ${selectOption.value}
 INSTRUCTION: - The user may want the sketch interpreted as one of these example${selectOption.value}. - Analyze the drawing JSON and determine the most likely type of UI. - Generate a fully functional, self-contained, single-page HTML file implementing that UI type, based on the drawing. - Output **only the HTML file text** (no code fences, no JSON wrapper, no extra explanation). Comments inside the HTML are allowed. TASK: 1. At the very top of the HTML, include an HTML comment that: - States the identification (e.g., "Likely a calculator") and confidence level. - Briefly maps major drawing regions to implemented UI areas (e.g., "top rectangle = header/logo; middle area = hero; 4x5 grid = keypad/buttons"). - If ambiguous (<60% confidence), explain briefly in the comment. 2. Generate a single-file HTML page that meets the following requirements depending on the example type: - **Calculator:** working numeric display, keypad with numbers/operators, keyboard support, responsive layout, at least one interactive feature. - **Portfolio:** header/nav, hero section, project cards, contact section, responsive layout, hover/animation effects. - **E-commerce home page:** header with logo/cart, hero banner, product grid with images/names/prices, footer, responsive layout, add-to-cart button interactions.
  - General: semantic HTML, inline CSS and JS only, mobile-first responsive, 
  accessible where appropriate, no external assets or libraries. 3. Include inline comments mapping code sections to drawing features. OUTPUT RULE: - Return ONLY the complete HTML file text (no extra text outside the HTML file). The top HTML comment may include identification and mapping. Now generate the single-file HTML implementing the UI based on the drawing and example type "{{EXAMPLE_TYPE}}".

       ` 
      });
      console.log(res.text);
      setResponse(res.text);
    } catch (err) {
      console.error(err);
      alert("Error generating HTML");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response)
      .then(() => alert("HTML code copied!"))
      .catch(err => alert("Failed to copy code:", err));
  };

  return (
    <div className="AppContainer">
   
      <div className="canvas-section">
        <h2>React Drawing Canvas</h2>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="controls">
          <button onClick={handleSend}>Capture JSON</button>
          <Select
            value={selectOption}
            onChange={setSelectOption}
            options={options}
            isSearchable={false}
            menuPortalTarget={document.body}
          />
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze with Gemini"}
          </button>
          <button onClick={handleCopy} disabled={!response}>Copy</button>
        </div>
      </div>

    
      <div className="preview-section">
        <h2>Preview</h2>
        <iframe
          title="HTML Preview"
          srcDoc={response}
        />
      </div>
    </div>
  );
}
