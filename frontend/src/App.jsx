import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FungiDetail from "./pages/FungiDetail";

import Definitions from "./pages/Definitions";
import About from "./pages/About";
import Communities from "./pages/Communities";
import Forage from "./pages/Forage";
import Learn from "./pages/Learn";

import LabLayout from "./layouts/LabLayout";
import LabDashboard from "./pages/LabDashboard";
import LabCatalog from "./pages/LabCatalog";
import LabSpecimens from "./pages/LabSpecimens";
import LabSpecimenForm from "./pages/LabSpecimenForm";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/fungi/:id" element={<FungiDetail />} />

                <Route path="/definitions" element={<Definitions />} />
                <Route path="/about" element={<About />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/forage" element={<Forage />} />
                <Route path="/learn" element={<Learn />} />

                <Route path="/lab" element={<LabLayout />}>
                    <Route index element={<LabDashboard />} />
                    <Route path="catalog" element={<LabCatalog />} />
                    <Route path="specimens" element={<LabSpecimens />} />
                    <Route path="specimens/new" element={<LabSpecimenForm mode="create" />} />
                    <Route path="specimens/:id/edit" element={<LabSpecimenForm mode="edit" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
