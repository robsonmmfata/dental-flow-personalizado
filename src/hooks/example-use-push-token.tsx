
import React, { useEffect } from "react";
import { useRegisterPushToken } from "./useRegisterPushToken";

/**
 * Exemplo fictício de uso:
 * Em um app real, `pushToken` viria do serviço de push (ex: Firebase, navegador, etc).
 */
export function ExamplePushTokenComponent() {
  // Substitua pelo ID do usuário logado (ex: user.id ou email)
  const user_id = "demo-user-id";
  // Substitua pelo token real capturado do navegador ou app
  const pushToken = "fake-token-aqui";
  const platform = "web";

  const { registerPushToken } = useRegisterPushToken();

  useEffect(() => {
    // Simule o registro do token
    registerPushToken({ user_id, token: pushToken, platform })
      .then((res) => {
        if (res.success) {
          console.log("Token push cadastrado com sucesso!");
        } else if (res.error) {
          console.error("Falha ao cadastrar token push:", res.error);
        }
      });
  }, [user_id, pushToken, platform, registerPushToken]);

  return null;
}
