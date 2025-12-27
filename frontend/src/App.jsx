import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FungiDetail from "./pages/FungiDetail";

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
