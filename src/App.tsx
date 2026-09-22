import { Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { releases } from "@/content/load";
import HistoryPage from "@/app/HistoryPage";
import NotFound from "@/app/NotFound";

const first = releases[0].id;

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <Routes>
        <Route path="/" element={<Navigate to={`/${first}/release`} replace />} />
        <Route path="/:releaseId" element={<HistoryPage />} />
        <Route path="/:releaseId/:tab" element={<HistoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
}
