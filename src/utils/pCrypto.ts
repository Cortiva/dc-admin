import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";

const secretKey = import.meta.env.VITE_API_KEY as string;
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY as string;

export const encryptData = (data: unknown): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = <T = unknown>(cipherText: string): T => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
};

export const decryptApiData = (encryptedData: string): string | null => {
    try {
        const [ivHex, encryptedTextHex] = encryptedData.split(":");
        const key = CryptoJS.enc.Hex.parse(encryptionKey);
        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const encryptedText = CryptoJS.enc.Hex.parse(encryptedTextHex);

        const encryptedParams = CryptoJS.lib.CipherParams.create({
            ciphertext: encryptedText,
        });

        const decrypted = CryptoJS.AES.decrypt(encryptedParams, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};

// Utility: Decode a JWT token
export const decodeJWT = <T extends JwtPayload = JwtPayload>(
    jwtToken: string,
): T | null => {
    try {
        return jwtDecode<T>(jwtToken);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};
