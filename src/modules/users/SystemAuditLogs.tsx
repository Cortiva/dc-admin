"use client";

import { Users } from "lucide-react";
import AppLayout from "../../components/layouts/AppLayout";
import PageHeader from "../../components/PageHeader";
import AuditLogsTab from "./components/AuditLogsTab";

export default function SystemAuditLogsPage() {

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <PageHeader
                        icon={<Users />}
                        title="System Audit Logs"
                        subtitle="View and manage system audit logs"
                    />
                    <div className="flex items-center gap-3">
                        
                    </div>
                </div>

                {/* Main Tabs */}
                <AuditLogsTab />

            </div>
        </AppLayout>
    );
}