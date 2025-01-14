import { Routes, Route } from "react-router-dom";
import { RiskList } from "@/components/risk/RiskList";
import { RiskDetails } from "@/components/risk/RiskDetails";
import { CreateRiskForm } from "@/components/risk/CreateRiskForm";

export default function RiskManagement() {
  return (
    <div className="container mx-auto py-6">
      <Routes>
        <Route index element={<RiskList />} />
        <Route path="create" element={<CreateRiskForm />} />
        <Route path=":id" element={<RiskDetails />} />
      </Routes>
    </div>
  );
}