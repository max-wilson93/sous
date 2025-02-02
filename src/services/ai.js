import axios from 'axios';

const HF_API_URL = 'https://api.aimlapi.com/v1'; // Correct base URL
const HF_API_TOKEN = '0f5d83585a2f43ca8590acf3ff3b3802'; // Replace with your API key

// Function to fetch recipe suggestions
export const fetchRecipe = async (ingredients) => {
  try {
    const systemPrompt = "You are a skilled chef. Generate a recipe based on the ingredients provided.";
    const userPrompt = `Create a recipe using the following ingredients: ${ingredients}`;

    const response = await axios.post(
      `${HF_API_URL}/chat/completions`, // Correct endpoint
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2", // Model from example, change to your preferred model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 256,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        },
      }
    );

    const recipe = response.data.choices[0]?.message.content || 'No recipe found.';
    return recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw new Error('Failed to fetch recipe. Please try again.');
  }
};

export default fetchRecipe;
