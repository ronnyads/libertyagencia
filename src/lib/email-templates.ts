export function templateDemoGratuita(nome: string, whatsapp: string): { subject: string; html: string } {
  return {
    subject: `Recebemos sua solicitacao, ${nome}!`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Solicitacao recebida</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:12px;border:1px solid #1e1e1e;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #1e1e1e;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                LIBERTY<span style="color:#00d4ff;">.</span>
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#00d4ff;text-transform:uppercase;letter-spacing:2px;">Solicitacao recebida</p>
              <h1 style="margin:0 0 24px;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">
                Ola, ${nome}!
              </h1>
              <p style="margin:0 0 16px;font-size:15px;color:#888888;line-height:1.6;">
                Recebemos sua solicitacao de demo gratuita. Nossa equipe vai analisar seu negocio e entrar em contato em ate <strong style="color:#ffffff;">24 horas</strong> via WhatsApp.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#888888;line-height:1.6;">
                WhatsApp cadastrado: <strong style="color:#ffffff;font-family:monospace;">${whatsapp}</strong>
              </p>
              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #1e1e1e;margin:0 0 32px;" />
              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 12px;">
                    <p style="margin:0;font-size:14px;color:#666666;">
                      <span style="color:#00d4ff;margin-right:8px;">✓</span> Sem cartao de credito
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;">
                    <p style="margin:0;font-size:14px;color:#666666;">
                      <span style="color:#00d4ff;margin-right:8px;">✓</span> Resultado real, nao apresentacao
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0;font-size:14px;color:#666666;">
                      <span style="color:#00d4ff;margin-right:8px;">✓</span> Resposta em ate 24h
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1e1e1e;background-color:#0d0d0d;">
              <p style="margin:0;font-size:12px;color:#444444;line-height:1.6;">
                Equipe Liberty Agencia &mdash; Especialistas em IA para negocios<br />
                Voce recebeu este e-mail porque se cadastrou em adsliberty.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}

export function templateMentoria(nome: string, whatsapp: string): { subject: string; html: string } {
  return {
    subject: `Candidatura recebida, ${nome}!`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Candidatura recebida</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:12px;border:1px solid #1e1e1e;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #1e1e1e;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                LIBERTY<span style="color:#00d4ff;">.</span>
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#00d4ff;text-transform:uppercase;letter-spacing:2px;">Candidatura recebida</p>
              <h1 style="margin:0 0 24px;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">
                Ola, ${nome}!
              </h1>
              <p style="margin:0 0 16px;font-size:15px;color:#888888;line-height:1.6;">
                Recebemos sua candidatura para a <strong style="color:#ffffff;">Mentoria 1:1</strong>. Nossa equipe vai analisar seu perfil e entrar em contato em ate <strong style="color:#ffffff;">24 horas</strong> via WhatsApp.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#888888;line-height:1.6;">
                WhatsApp cadastrado: <strong style="color:#ffffff;font-family:monospace;">${whatsapp}</strong>
              </p>
              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #1e1e1e;margin:0 0 32px;" />
              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 12px;">
                    <p style="margin:0;font-size:14px;color:#666666;">
                      <span style="color:#00d4ff;margin-right:8px;">✓</span> 1 call ao vivo por semana
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;">
                    <p style="margin:0;font-size:14px;color:#666666;">
                      <span style="color:#00d4ff;margin-right:8px;">✓</span> Suporte via WhatsApp durante 3 meses
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0;font-size:14px;color:#666666;">
                      <span style="color:#00d4ff;margin-right:8px;">✓</span> Apenas 2 vagas disponiveis por turma
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1e1e1e;background-color:#0d0d0d;">
              <p style="margin:0;font-size:12px;color:#444444;line-height:1.6;">
                Equipe Liberty Agencia &mdash; Mentoria 1:1 em IA e tecnologia<br />
                Voce recebeu este e-mail porque se candidatou em adsliberty.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  }
}
