import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "gamevion/qris";

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHmac("sha1", API_SECRET)
      .update(paramsToSign)
      .digest("hex");

    const uploadForm = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    uploadForm.append("file", blob, file.name);
    uploadForm.append("api_key", API_KEY);
    uploadForm.append("timestamp", timestamp.toString());
    uploadForm.append("folder", folder);
    uploadForm.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    const data = await res.json();

    if (data.secure_url) {
      return NextResponse.json({ url: data.secure_url });
    } else {
      return NextResponse.json(
        { error: data.error?.message || JSON.stringify(data) },
        { status: 500 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
