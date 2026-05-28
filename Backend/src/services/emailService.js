import nodemailer from "nodemailer";

let transporterCache = null;

const criarTransporterEthereal = async () => {
  const contaTeste = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: contaTeste.user,
      pass: contaTeste.pass
    }
  });
};

const criarTransporterSmtp = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error("Configuracoes de e-mail ausentes no .env");
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
};

const criarTransporter = async () => {
  if (transporterCache) {
    return transporterCache;
  }

  if (process.env.EMAIL_PROVIDER === "ethereal" || !process.env.EMAIL_HOST) {
    transporterCache = await criarTransporterEthereal();
    return transporterCache;
  }

  transporterCache = criarTransporterSmtp();
  return transporterCache;
};

const remetente = () => process.env.EMAIL_FROM || process.env.EMAIL_USER;

const enviarEmail = async (opcoes) => {
  const transporter = await criarTransporter();
  const info = await transporter.sendMail(opcoes);
  const previewUrl = nodemailer.getTestMessageUrl(info);

  if (previewUrl) {
    console.log("Preview do e-mail Ethereal:", previewUrl);
  }

  return info;
};

export const enviarEmailConfirmacao = async (email, nome, link) => {
  await enviarEmail({
    from: remetente(),
    to: email,
    subject: "Confirmacao de adocao - Abrigo Teodoro",
    html: `
      <p>Ola, ${nome}.</p>
      <p>Confirme sua adocao acessando o link abaixo:</p>
      <p><a href="${link}">${link}</a></p>
    `
  });
};

export const enviarEmailRedefinicaoSenha = async (email, nome, senhaTemporaria) => {
  await enviarEmail({
    from: remetente(),
    to: email,
    subject: "Redefinicao de senha - Abrigo Teodoro",
    html: `
      <p>Ola, ${nome}.</p>
      <p>Sua senha foi redefinida. Use a senha temporaria abaixo para acessar o sistema:</p>
      <p><strong>${senhaTemporaria}</strong></p>
      <p>Apos entrar, altere sua senha para uma nova de sua preferencia.</p>
    `
  });
};
