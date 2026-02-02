import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-USERS] ${step}${detailsStr}`);
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create client with user's token to verify they're authenticated
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    logStep("User authenticated", { userId: user.id });

    // Create admin client to check roles and fetch users
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      logStep("User is not admin", { userId: user.id });
      throw new Error("Forbidden: Admin access required");
    }

    logStep("Admin access verified");

    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (method === "GET") {
      // Fetch all users with their profiles and roles
      const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (usersError) {
        throw usersError;
      }

      // Fetch profiles
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("*");

      // Fetch roles
      const { data: roles } = await supabaseAdmin
        .from("user_roles")
        .select("*");

      // Combine data
      const usersWithData = users.map(u => {
        const profile = profiles?.find(p => p.id === u.id);
        const userRoles = roles?.filter(r => r.user_id === u.id).map(r => r.role) || [];
        
        return {
          id: u.id,
          email: u.email,
          name: profile?.name || null,
          plan: profile?.plan || 'free',
          roles: userRoles,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
        };
      });

      logStep("Users fetched", { count: usersWithData.length });

      return new Response(JSON.stringify({ users: usersWithData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (method === "POST") {
      const body = await req.json();
      const { userId, role, action: roleAction } = body;

      if (!userId || !role) {
        throw new Error("userId and role are required");
      }

      if (roleAction === "add") {
        // Add role
        const { error: insertError } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role });

        if (insertError) {
          if (insertError.code === "23505") {
            throw new Error("User already has this role");
          }
          throw insertError;
        }

        logStep("Role added", { userId, role });
      } else if (roleAction === "remove") {
        // Remove role
        const { error: deleteError } = await supabaseAdmin
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);

        if (deleteError) {
          throw deleteError;
        }

        logStep("Role removed", { userId, role });
      } else {
        throw new Error("Invalid action. Use 'add' or 'remove'");
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Method not allowed");

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message });
    
    const status = message.includes("Unauthorized") ? 401 
      : message.includes("Forbidden") ? 403 
      : 400;

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
