import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dqjh7utdb";
const API_KEY = process.env.CLOUDINARY_API_KEY || "777554387275569";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "5PdPYFpl6ZQh8uDm_uC9oveQaV0";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "gamevion/qris";

    // Create signature for signed upload
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHmac("sha1", API_SECRET)
      .update(paramsToSign)
      .digest("hex");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("api_key", API_KEY);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("folder", folder);
    uploadFormData.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadFormData }
    );

    const data = await res.json();

    if (data.secure_url) {
      return NextResponse.json({ url: data.secure_url });
    } else {
      return NextResponse.json({ error: data.error?.message || "Upload failed" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
