export default function PageHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
    return (
        <div className="flex flex-row items-center space-x-4">
            <div className="flex flex-row items-center justify-center p-3 bg-card rounded-lg shadow-sm ">
                { icon }
            </div>

            <div>
                <h1 className="text-xl font-semibold font-heading">
                    { title }
                </h1>
                <p className="text-sm text-muted-foreground">
                    { subtitle }
                </p>
            </div>
        </div>
    );
};