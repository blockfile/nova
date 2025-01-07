import React, { useState, useRef, useEffect } from "react";
import bg from "../assets/images/cyberbg.mp4"; // Background video
import "./terminal.css"; // Fancy button design
import holo from "../assets/images/holo.png";
import terminal from "../assets/images/terminal.png";
import logo from "../assets/images/novalogo.png";

function Terminal() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState([
        "Microsoft Windows [Version 10.0.19631.1]",
        "(c) 2020 Microsoft Corporation. All rights reserved.",
    ]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleInput = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() !== "") {
            const userCommand = `C:\\Users\\shiva> ${input}`;
            setOutput((prev) => [...prev, userCommand]);

            try {
                setLoading(true);
                let res;
                const lowerInput = input.toLowerCase();

                if (
                    lowerInput.startsWith("can you generate") &&
                    lowerInput.replace("can you generate", "").trim() !== ""
                ) {
                    res = await fetch(
                        "http://localhost:3001/api/generateImages",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                prompt: input
                                    .replace("can you generate", "")
                                    .trim(),
                            }),
                        }
                    );
                } else {
                    res = await fetch("http://localhost:3001/api/generate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ prompt: input }),
                    });
                }

                const data = await res.json();

                if (data.imageUrl || data.response) {
                    setOutput((prev) => [
                        ...prev,
                        data.response || "",
                        data.imageUrl && (
                            <img
                                key={output.length}
                                src={data.imageUrl}
                                alt="Generated"
                                className="mt-4 rounded-lg shadow-lg"
                                style={{ maxWidth: "100%", maxHeight: "400px" }}
                            />
                        ),
                    ]);
                } else {
                    setOutput((prev) => [
                        ...prev,
                        "Error: No response received.",
                    ]);
                }
            } catch (error) {
                console.error("Error:", error);
                setOutput((prev) => [...prev, "Error fetching response."]);
            } finally {
                setLoading(false);
            }

            setInput("");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-cover bg-center relative font-zen pb-32">
            <video
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover z-0">
                <source src={bg} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-white opacity-30 z-10"></div>
            <div className="absolute inset-0 bg-black opacity-50 z-20"></div>

            <div className="z-30 relative w-full flex flex-col items-center">
                <div className="flex  items-center mb-12 mt-14">
                    <img
                        src={logo}
                        alt="NOVA Logo"
                        className="w-20 h-20 md:w-32 md:h-32 absolute"
                    />
                    <img
                        src={holo}
                        alt="Holo"
                        className="w-28 md:w-40 mt-4 animate-pulse"
                        style={{ fontFamily: "Nuku" }}
                    />
                    <h1 className="text-4xl md:text-[100px] font-bold  mt-4 font-Nuku tracking-widest text-pink-600">
                        NOVA AI
                    </h1>
                </div>

                <div className="relative w-full flex justify-center items-center">
                    <div className="relative w-[900px] h-[600px] flex justify-center items-center z-20">
                        <img
                            src={terminal}
                            alt="Terminal Border"
                            className="absolute inset-0 w-full md:h-full h-[650px] px-3"
                        />
                        <div
                            ref={terminalRef}
                            className="absolute inset-0 flex flex-col justify-between p-6">
                            <div className="terminal-content overflow-y-auto h-[450px] text-green-400 mt-10 ml-5 font-Graduate uppercase">
                                {output.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                                {loading && (
                                    <p className="text-yellow-300">
                                        Generating...
                                    </p>
                                )}
                            </div>
                            <div className="terminal-footer mb-10 ml-6 uppercase text-green-300 font-Graduate">
                                <span>C:\Nova\AI></span>
                                <form
                                    onSubmit={handleSubmit}
                                    className="inline">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="terminal-input"
                                        value={input}
                                        onChange={handleInput}
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Terminal;
