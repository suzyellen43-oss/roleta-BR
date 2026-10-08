/**
 * CONFIGURAÇÃO DA PÁGINA DE PRÉ-SELL / CAMPANHA
 * 
 * Modifique os valores abaixo conforme sua campanha:
 */
export const CAMPAIGN_CONFIG = {
  // LINK DE CADASTRO
  // Substitua pelo seu link de afiliado ou página de registro oficial:
  REGISTER_URL: "https://one-vv4164.com/casino/list?open=register&p=0dzh",

  // Destino do clique ("_blank" para abrir em nova aba, "_self" para mesma aba)
  REGISTER_TARGET: "_blank",

  // LOGOTIPO DA MARCA
  // Logo oficial 1win configurada conforme solicitação
  BRAND_NAME: "1win",
  BRAND_TAGLINE: "OFERTA EXCLUSIVA DE BOAS-VINDAS",
  LOGO_IMAGE_URL: "/assets/1win-logo.svg",

  // CONFIGURAÇÃO DO RESULTADO
  // Sempre parar no setor "500% de bônus" conforme solicitado
  ALWAYS_WIN_500_BONUS: true,

  // TEMPO DE GIRO DA ROLETA
  // Tempo de rotação em milissegundos (recomendado entre 4500ms e 5200ms)
  SPIN_DURATION_MS: 4800,

  // QUANTIDADE DE VOLTAS COMPLETAS NO GIRO
  // Mínimo de voltas antes de parar no setor sorteado
  MIN_FULL_REVOLUTIONS: 5,
};
