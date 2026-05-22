import { Bell, UserPlus, Calendar, Award, Star, ChevronRight } from "lucide-react";
import { Card } from "../../../components/ui/card";

const recentNotifications = [
    {
        id: 1,
        title: "New Member",
        message: "Oluwaseun Adebayo joined",
        time: "2 min ago",
        type: "member",
        isNew: true
    },
    {
        id: 2,
        title: "First Timer",
        message: "Chinedu Okonkwo (85% interest)",
        time: "1 hour ago",
        type: "visitor",
        isNew: true
    },
    {
        id: 3,
        title: "Training Complete",
        message: "Amara Eze completed DCA Basic",
        time: "5 hours ago",
        type: "training",
        isNew: false
    },
    {
        id: 4,
        title: "Event Reminder",
        message: "Leadership Conference in 3 days",
        time: "Yesterday",
        type: "event",
        isNew: false
    },
    {
        id: 5,
        title: "Birthday",
        message: "Grace Okafor turns 39 today",
        time: "Yesterday",
        type: "birthday",
        isNew: false
    },
    {
        id: 6,
        title: "High Interest",
        message: "Oluwatobi Adeleke (95% interest)",
        time: "Yesterday",
        type: "visitor",
        isNew: false
    },
    {
        id: 7,
        title: "Second Timer",
        message: "Samuel Obi visited again",
        time: "2 days ago",
        type: "visitor",
        isNew: false
    },
    {
        id: 8,
        title: "Department Update",
        message: "Blessing Okafor → Media Dept",
        time: "2 days ago",
        type: "member",
        isNew: false
    },
    {
        id: 9,
        title: "DCA Enrollment",
        message: "5 new enrollments this week",
        time: "3 days ago",
        type: "training",
        isNew: false
    },
    {
        id: 10,
        title: "System Update",
        message: "New features available",
        time: "3 days ago",
        type: "system",
        isNew: false
    }
];

const getIcon = (type: string) => {
    switch(type) {
        case 'member': return <UserPlus className="w-4 h-4 text-green-500" />;
        case 'visitor': return <Star className="w-4 h-4 text-blue-500" />;
        case 'training': return <Award className="w-4 h-4 text-orange-500" />;
        case 'event': return <Calendar className="w-4 h-4 text-purple-500" />;
        default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
};

export function CompactNotifications() {
    return (
        <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <h3 className="font-semibold">Recent Activity</h3>
                </div>
                <span className="text-xs text-muted-foreground">Last 10</span>
            </div>

            <div className="space-y-3">
                {recentNotifications.map((notif) => (
                    <div 
                        key={notif.id}
                        className={`flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-muted/30 cursor-pointer ${notif.isNew ? 'bg-primary/5' : ''}`}
                    >
                        <div className="shrink-0 mt-0.5">
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className={`text-sm font-medium truncate ${notif.isNew ? 'text-primary' : ''}`}>
                                    {notif.title}
                                </p>
                                <span className="text-xs text-muted-foreground shrink-0">
                                    {notif.time}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                                {notif.message}
                            </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-muted-card">
                <button className="w-full text-center text-xs text-primary hover:underline">
                    View all notifications
                </button>
            </div>
        </Card>
    );
}