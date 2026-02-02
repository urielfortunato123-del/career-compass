import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-WELCOME-EMAIL] ${step}${detailsStr}`);
};

interface WelcomeEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { email, name }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    logStep("Sending welcome email", { email, name });

    const userName = name || "usuário";

    const emailResponse = await resend.emails.send({
      from: "VagaJusta <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 Bem-vindo ao VagaJusta Pro!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0b;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">
                🚀 VagaJusta
              </h1>
              <p style="color: #14b8a6; font-size: 14px; margin-top: 8px;">
                Análise de Currículos com IA
              </p>
            </div>

            <!-- Main Content -->
            <div style="background: linear-gradient(135deg, #1a1a1b 0%, #0f0f10 100%); border-radius: 16px; padding: 40px; border: 1px solid #2a2a2b;">
              <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 16px 0; text-align: center;">
                Bem-vindo ao Pro, ${userName}! 🎉
              </h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
                Sua assinatura foi ativada com sucesso. Agora você tem acesso a todos os recursos premium!
              </p>

              <!-- Features -->
              <div style="background: #0f0f10; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #14b8a6; font-size: 16px; margin: 0 0 16px 0;">
                  ✨ O que você pode fazer agora:
                </h3>
                <ul style="color: #ffffff; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                  <li>Análises ilimitadas de compatibilidade</li>
                  <li>Currículos ATS otimizados para cada vaga</li>
                  <li>Planos de ação personalizados</li>
                  <li>Simulador de entrevistas com IA</li>
                  <li>Modo Transição de Carreira</li>
                  <li>Suporte prioritário</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center;">
                <a href="https://vagajusta.app/app" 
                   style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Começar Agora →
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #71717a; font-size: 12px; margin: 0;">
                Você recebeu este email porque assinou o VagaJusta Pro.
              </p>
              <p style="color: #71717a; font-size: 12px; margin-top: 8px;">
                Dúvidas? Responda este email ou acesse nossa 
                <a href="https://vagajusta.app/ajuda" style="color: #14b8a6;">Central de Ajuda</a>.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    logStep("Email sent successfully", { response: emailResponse });

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR sending email", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
