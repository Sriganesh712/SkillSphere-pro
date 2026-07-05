export async function uploadVideoToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "skillsphere");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dzrcyt0d8/video/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Video upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}

export async function uploadImageToCloudinary(file) {
  const cloudName = "dzrcyt0d8";
  const uploadPreset = "skillsphere";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "skillsphere/avatars");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}
export async function uploadFileToCloudinary(file) {
  if (!file || file.type !== "application/pdf") {
    throw new Error("Invalid PDF file");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "skillsphere");
  formData.append("folder", "skillsphere/pdfs");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dzrcyt0d8/raw/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("PDF upload failed");
  }

  const data = await res.json();

  // 🔥 FORCE CORRECT HEADERS
  return (
    data.secure_url +
    "?response-content-disposition=inline" +
    "&response-content-type=application/pdf"
  );
}

