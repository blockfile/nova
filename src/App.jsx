import React from "react";
import Terminal from "../src/components/pages/terminal";
import Footer from "../src/components/footer/footer";

function App() {
    return (
        <div className="h-screen flex flex-col justify-between">
            <Terminal />
            <Footer />
        </div>
    );
}

export default App;
