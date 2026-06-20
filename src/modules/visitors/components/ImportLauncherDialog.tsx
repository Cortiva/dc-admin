import { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../../components/ui/dialog";
import { Download, Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { RawImportRow } from "../visitorValidation";
import { downloadVisitorImportTemplate } from "../visitorTemplate";
import { parseVisitorSheet } from "../visitorSheetParser";

interface ImportLauncherDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onParsed: (rows: RawImportRow[]) => void;
}

export function ImportLauncherDialog({ isOpen, onClose, onParsed }: ImportLauncherDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isParsing, setIsParsing] = useState(false);

    const handleDownload = () => {
        downloadVisitorImportTemplate();
        toast.success("Template downloaded");
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        try {
            const result = await parseVisitorSheet(file);

            if (result.rows.length === 0) {
                toast.error("That sheet doesn't have any visitor rows in it");
                return;
            }
            if (result.missingColumns.length > 0) {
                toast.error(
                    `Missing columns: ${result.missingColumns.slice(0, 3).join(", ")}${
                        result.missingColumns.length > 3 ? "..." : ""
                    }. Use the downloaded template to be sure columns match.`,
                );
                return;
            }

            onParsed(result.rows);
        } catch (err) {
            console.error(err);
            toast.error("Couldn't read that file. Make sure it's a .xlsx or .csv file.");
        } finally {
            setIsParsing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Import visitors</DialogTitle>
                    <DialogDescription>
                        Add many visitors at once from a spreadsheet.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full flex items-start gap-3 p-4 rounded-lg border hover:border-primary/40 hover:bg-muted/30 transition-colors text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Download className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">Download the template</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                An Excel file with the right columns and dropdowns already set up.
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isParsing}
                        className="w-full flex items-start gap-3 p-4 rounded-lg border hover:border-primary/40 hover:bg-muted/30 transition-colors text-left disabled:opacity-60"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            {isParsing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-sm">
                                {isParsing ? "Reading your file..." : "Upload a filled-in sheet"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                .xlsx or .csv — you'll get to review everything before it's saved.
                            </p>
                        </div>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                    <FileSpreadsheet className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                        Nothing is saved until you review the rows and confirm — invalid rows
                        are flagged so you can fix or remove them first.
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}