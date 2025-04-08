import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { error: verifyError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (verifyError) {
      throw new Error('Invalid authorization token');
    }

    // Handle admin routes
    const url = new URL(req.url);
    const path = url.pathname.replace('/admin', '');

    switch (path) {
      case '/users':
        const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
        if (usersError) throw usersError;
        return new Response(JSON.stringify(users), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case '/user':
        const userId = url.searchParams.get('id');
        if (!userId) throw new Error('Missing user ID');
        
        const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError) throw userError;
        
        return new Response(JSON.stringify(user), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        throw new Error('Invalid admin route');
    }
  } catch (error) {
    console.error('Admin function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});