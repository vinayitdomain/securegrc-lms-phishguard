import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentAssignment } from "@/types/incidents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IncidentAssignmentsProps {
  assignments: IncidentAssignment[];
}

export function IncidentAssignments({ assignments }: IncidentAssignmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${assignment.assigned_to}`} />
                <AvatarFallback>UA</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{assignment.assigned_to}</p>
                <p className="text-sm text-muted-foreground">{assignment.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}