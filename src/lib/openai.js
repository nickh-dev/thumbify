/**
 * Sends a prompt to the /api/generate-image endpoint
 * and returns the generated image URL from GPT-4o.
 *
 * @param {string} prompt - The description for the image
 * @returns {Promise<string>} - The URL of the generated image
 */
export async function generateImage(prompt) {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate image");
    }

    const imageUrl = data?.imageUrl;
    if (!imageUrl) {
      throw new Error("Image URL not returned from API");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error in generateImage:", error);
    throw error;
  }
}
