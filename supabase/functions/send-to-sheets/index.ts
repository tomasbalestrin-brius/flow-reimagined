import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormData {
  nome: string;
  telefone: string;
  email: string;
  instagram: string;
  nicho: string;
  cargo: string;
  faturamento: string;
  dificuldade: string;
  outraDificuldade?: string;
  investimento: string;
  dataAgendamento: string;
  horarioAgendamento: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: FormData = await req.json();
    console.log('Received form data:', formData);

    const serviceAccountEmail = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const privateKey = Deno.env.get('GOOGLE_PRIVATE_KEY');
    const spreadsheetId = '1xWa5PTcX9to0cjAsJOTuA9HVSZo7hcRT5wfta2qn7Fg';

    if (!serviceAccountEmail || !privateKey) {
      throw new Error('Google credentials not configured');
    }

    // Create JWT for Google API authentication
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const claim = {
      iss: serviceAccountEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    // Encode header and claim
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedClaim = btoa(JSON.stringify(claim));
    const unsignedToken = `${encodedHeader}.${encodedClaim}`;

    // Import the private key
    const pemContents = privateKey.replace(/\\n/g, '\n');
    const binaryDer = Uint8Array.from(
      atob(
        pemContents
          .replace('-----BEGIN PRIVATE KEY-----', '')
          .replace('-----END PRIVATE KEY-----', '')
          .replace(/\s/g, '')
      ),
      (c) => c.charCodeAt(0)
    );

    const key = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    // Sign the token
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      new TextEncoder().encode(unsignedToken)
    );

    const encodedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signature))
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const jwt = `${unsignedToken}.${encodedSignature}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Format data for Google Sheets
    const dificuldadeCompleta = formData.dificuldade === 'Outro' 
      ? formData.outraDificuldade 
      : formData.dificuldade;

    const rowData = [
      new Date().toISOString(),
      formData.nome,
      formData.telefone,
      formData.email,
      formData.instagram,
      formData.nicho,
      formData.cargo,
      formData.faturamento,
      dificuldadeCompleta,
      formData.investimento,
      formData.dataAgendamento,
      formData.horarioAgendamento,
    ];

    // Append data to Google Sheets
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1:append?valueInputOption=RAW`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData],
        }),
      }
    );

    const sheetsData = await sheetsResponse.json();
    console.log('Sheets response:', sheetsData);

    if (!sheetsResponse.ok) {
      throw new Error(`Google Sheets API error: ${JSON.stringify(sheetsData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: sheetsData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-to-sheets function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
