import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CalendarView } from "@/components/calendar/CalendarView";
import { EventForm } from "@/components/calendar/EventForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Calendar() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Training Calendar</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <EventForm />
            </DialogContent>
          </Dialog>
        </div>
        <CalendarView />
      </div>
    </DashboardLayout>
  );
}