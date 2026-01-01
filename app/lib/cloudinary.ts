export const CLOUDINARY_CONFIG = {
    cloudName: "dnko3bvt0",
    apiKey: "861875379839891",
    uploadPreset: "kizuna_unsigned"
};

/**
 * Uploads an image or video to Cloudinary using the unsigned upload preset.
 * This is safe for client-side usage as it doesn't require the API Secret.
 */
export async function uploadToCloudinary(file: File | Blob): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Cloudinary upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
}
