
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Registra/atualiza o token do dispositivo no Supabase.
 * @param user_id - ID do usuário (ou e-mail se aplicável)
 * @param token - Token do dispositivo recebido do serviço de push
 * @param platform - 'web' | 'android' | 'ios'
 */
export function useRegisterPushToken() {
  const registerPushToken = useCallback(
    async ({
      user_id,
      token,
      platform = "web"
    }: { user_id?: string; token: string; platform?: string }) => {
      if (!token) return { error: "Token push ausente!" };

      // Verifica se já existe o token para esse user_id/plataforma/token
      const { data: existing, error: fetchError } = await supabase
        .from("device_push_tokens")
        .select("id")
        .eq("user_id", user_id || "")
        .eq("token", token)
        .eq("platform", platform)
        .maybeSingle();

      if (fetchError) return { error: fetchError.message };

      if (existing?.id) {
        // Atualiza o last_used_at
        const { error: updateError } = await supabase
          .from("device_push_tokens")
          .update({ last_used_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (updateError) return { error: updateError.message };
        return { success: true };
      }

      // Senão, cria
      const { error: insertError } = await supabase
        .from("device_push_tokens")
        .insert({
          user_id: user_id || "",
          token,
          platform,
        });
      if (insertError) return { error: insertError.message };
      return { success: true };
    },
    []
  );

  return { registerPushToken };
}
