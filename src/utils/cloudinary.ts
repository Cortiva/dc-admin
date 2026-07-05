interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
}

interface UploadOptions {
    folder?: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    crop?: "limit" | "fill" | "scale";
}

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export async function uploadToCloudinary(
    file: File,
    options: UploadOptions = {},
): Promise<CloudinaryUploadResponse> {
    const { folder = "members" } = options;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folder);
    // no transformation param — not allowed on unsigned uploads

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Upload failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}

export function getOptimizedImageUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        crop?: "fill" | "limit" | "scale" | "thumb";
        quality?: number;
        format?: "auto" | "webp" | "png" | "jpg";
    } = {},
): string {
    const {
        width = 400,
        height = 400,
        crop = "limit",
        quality = 80,
        format = "auto",
    } = options;

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_${crop},w_${width},h_${height},q_${quality},f_${format}/${publicId}`;
}
