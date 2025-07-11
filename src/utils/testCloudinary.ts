/**
 * Utility to test Cloudinary configuration
 * Run this from browser console to verify your setup
 */

export const testCloudinaryConfig = async () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.error("❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");
    return false;
  }

  console.log("🔍 Testing Cloudinary configuration...");
  console.log(`Cloud Name: ${cloudName}`);

  try {
    // Test if the cloud name exists by making a simple request
    const response = await fetch(
      `https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg`
    );

    if (response.ok) {
      console.log("✅ Cloudinary cloud name is valid");
      return true;
    } else {
      console.error(
        "❌ Invalid cloud name or Cloudinary account not accessible"
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing Cloudinary:", error);
    return false;
  }
};

export const testUploadPreset = async (presetName: string = "ml_default") => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.error("❌ Cloud name not configured");
    return false;
  }

  console.log(`🔍 Testing upload preset: ${presetName}`);

  // Create a small test image (1x1 pixel)
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1, 1);
  }

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("❌ Failed to create test image");
        resolve(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", presetName);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("✅ Upload preset is working!");
          console.log("Test upload result:", result.secure_url);
          resolve(true);
        } else {
          const errorData = await response.text();
          console.error("❌ Upload preset test failed:", errorData);
          resolve(false);
        }
      } catch (error) {
        console.error("❌ Error testing upload preset:", error);
        resolve(false);
      }
    });
  });
};

// Run this in browser console to test everything
export const runFullTest = async () => {
  console.log("🚀 Starting Cloudinary configuration test...");

  const configTest = await testCloudinaryConfig();
  if (!configTest) {
    console.log(
      "❌ Configuration test failed. Please check your environment variables."
    );
    return;
  }

  const presetTest = await testUploadPreset();
  if (presetTest) {
    console.log("🎉 All tests passed! Your Cloudinary setup is working.");
  } else {
    console.log(
      "⚠️ Upload preset test failed. You may need to create a custom upload preset."
    );
    console.log("📋 Instructions:");
    console.log("1. Go to https://cloudinary.com/console/settings/upload");
    console.log("2. Create a new upload preset named 'spoty_uploads'");
    console.log("3. Set it as 'Unsigned'");
    console.log("4. Update the DEFAULT_UPLOAD_PRESET in cloudinary.ts");
  }
};
