import { BrowserRouter, Route, Routes } from "react-router";

import Home from "@Pages/Home/Home";
import Dashboard from "@Pages/App/Dashboard";
import Registry from "@Pages/App/Registry";
import Upload from "@Pages/App/Upload";
import Verify from "@Pages/App/Verify";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/app" element={<Dashboard />} />
                <Route path="/app/upload" element={<Upload />} />
                <Route path="/app/verify" element={<Verify />} />
                <Route path="/app/registry" element={<Registry />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;