import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { 
    Upload, 
    Loader2, 
    Image as ImageIcon,
    Trash2,
    ZoomIn
} from 'lucide-react';
import { toast } from '../../../components/ui/sonner';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface ProfileImageUploadProps {
    currentImageUrl?: string | null;
    onUploadSuccess: (url: string, publicId: string) => void;
    onRemove?: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    uploadFolder?: string;
}

const sizeClasses = {
    sm: 'w-20 h-20 text-xs',
    md: 'w-32 h-32 text-sm',
    lg: 'w-48 h-48 text-base',
    xl: 'w-60 h-60 text-lg',
};

// const uploadSizeClasses = {
//     sm: 'w-20 h-20',
//     md: 'w-32 h-32',
//     lg: 'w-48 h-48',
//     xl: 'w-60 h-60',
// };

export function ProfileImageUpload({
    currentImageUrl,
    onUploadSuccess,
    onRemove,
    className = '',
    size = 'lg',
    disabled = false,
    uploadFolder = 'members',
}: ProfileImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    // const hasImage = currentImageUrl || previewUrl;
    const displayUrl = previewUrl || currentImageUrl;

    const handleFileSelect = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const result = await uploadToCloudinary(file, {
                folder: uploadFolder,
                maxWidth: 800,
                maxHeight: 800,
                quality: 90,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Update with secure URL from Cloudinary
            onUploadSuccess(result.secure_url, result.public_id);
            toast.success('Profile image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Please try again.');
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        if (onRemove) {
            onRemove();
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        if (!disabled && !isUploading) {
            fileInputRef.current?.click();
        }
    };

    // ─── Render ─────────────────────────────────────────────────────────────

    return (
        <div className={cn('flex flex-col items-center gap-3', className)}>
            {/* Main Avatar/Upload Area */}
            <div
                ref={dropZoneRef}
                className={cn(
                    'relative rounded-2xl overflow-hidden transition-all duration-300',
                    sizeClasses[size],
                    isUploading && 'opacity-70',
                    !disabled && 'cursor-pointer hover:ring-2 hover:ring-primary/50',
                    disabled && 'cursor-not-allowed opacity-60',
                    isHovering && 'ring-2 ring-primary ring-offset-2'
                )}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {/* Current Image */}
                {displayUrl ? (
                    <img
                        src={displayUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs text-center px-2">Click or drag to upload</span>
                    </div>
                )}

                {/* Upload Progress Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <div className="w-3/4 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                {!isUploading && !disabled && displayUrl && (
                    <div
                        className={cn(
                            'absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity duration-200',
                            isHovering ? 'opacity-100' : 'opacity-0'
                        )}
                    >
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDialogOpen(true);
                                }}
                            >
                                <ZoomIn className="w-3 h-3" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Upload Icon Overlay (when no image) */}
                {!displayUrl && !isUploading && !disabled && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Upload className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled || isUploading}
            />

            {/* Action Buttons */}
            <div className="flex gap-2">
                {!displayUrl && !isUploading && !disabled && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClick}
                        disabled={disabled}
                    >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload Photo
                    </Button>
                )}
                {displayUrl && !isUploading && !disabled && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClick}
                            disabled={disabled}
                        >
                            <Upload className="w-3 h-3 mr-1" />
                            Change
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                        </Button>
                    </>
                )}
            </div>

            {/* Size Hint */}
            {!displayUrl && !isUploading && (
                <p className="text-xs text-muted-foreground">
                    PNG, JPG or WEBP (max. 5MB)
                </p>
            )}

            {/* Full Image Preview Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Profile Image</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-4">
                        {displayUrl && (
                            <img
                                src={displayUrl}
                                alt="Profile preview"
                                className="max-h-[70vh] max-w-full rounded-lg object-contain"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}