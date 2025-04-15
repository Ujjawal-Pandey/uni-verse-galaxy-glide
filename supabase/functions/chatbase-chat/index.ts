import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CHATBASE_API_KEY = "4um20vhnnjrkwp83uqlo5rzt41nwkqvz";
const CHATBASE_API_URL = "https://www.chatbase.co/api/v1/chat";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!CHATBASE_API_KEY) {
      throw new Error("CHATBASE_API_KEY is not set in environment variables");
    }

    console.log("Received prompt:", prompt);

    const response = await fetch(CHATBASE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHATBASE_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: false,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("Chatbase response:", JSON.stringify(data).substring(0, 200) + "...");

    if (data.error) {
      throw new Error(`Chatbase API error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return new Response(JSON.stringify({ generatedText: data.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in chatbase-chat function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 