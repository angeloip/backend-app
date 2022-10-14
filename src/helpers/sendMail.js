const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const oauth2client = new OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  OAUTH_PLAYGROUND
);

const sendEmailRegister = async (to, url, text) => {
  try {
    oauth2client.setCredentials({
      refresh_token: process.env.G_REFRESH_TOKEN
    });

    const accessToken = await oauth2client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL,
        clientId: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        refreshToken: process.env.G_REFRESH_TOKEN,
        accessToken: accessToken
      },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: `Inkha Salud < ${process.env.ADMIN_EMAIL}>`,
      to: to,
      subject: "ACTIVA TU CUENTA",
      html: `<html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
              body {
                background-color: #333333;
                height: 100vh;
                font-family: 'Roboto', sans-serif;
                position: relative;
              }
              .container {
                max-width: 550px;
                width: 100%;
                heigth: 100%;
                margin: 30px auto;
              }
              .paragraph{
                  color: #4c4c4c;
              }
              .container p{
                  margin-bottom: 15px;
              }
              .container p{
                  font-size: 15px;
              }
              .wrapper{
                  padding: 0 15px;
              }
              .card {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 100%;
              }
              .link  {
                  border: 0;
                  background-color: #5cbb7b;
                  transition: all 0.3s ease-in;
                  cursor: pointer;
                  color: #fff !important;
                  padding: 10px 15px;
                  border-radius: 5px;
                  font-size: 18px;
                  text-decoration: none;
              }
              .link:hover {
                  background-color: #3da35f;
              }
              .spacing {
                  margin-top: 2rem
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="wrapper">
                  <div class="card">
                      <img style="width: 250px; margin-bottom: 10px;" src="https://i.postimg.cc/Y0k85mjt/logo.png" alt="InkhaSalud">
                      <h1 style="margin-bottom: 15px;" class="paragraph"><span style="color: #3da35f;">¡Bienvenido!</span>, gracias por registrarte</h1>
                      <p class="paragraph">Valide su correo electrónico haciendo clic en el botón de abajo 😄</p>
                      <a class="link" href=${url}>
                         ${text}
                      </a>
                      <p class="spacing paragraph">
                          Si el botón de arriba no funciona, ingrese al enlace que se proporciona a continuación 👇🏻
                      </p>
                      <span style="word-wrap: break-word; font-size: 15px;">       
                         ${url}
                      </span>
              </div>
          </div>
      </body>
      </html>`
    };

    return await smtpTransport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

const sendEmailReset = async (to, url, text, name) => {
  try {
    oauth2client.setCredentials({
      refresh_token: process.env.G_REFRESH_TOKEN
    });

    const accessToken = await oauth2client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL,
        clientId: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        refreshToken: process.env.G_REFRESH_TOKEN,
        accessToken: accessToken
      },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: `Inkha Salud < ${process.env.ADMIN_EMAIL}>`,
      to: to,
      subject: "RESTABLECER LA CONTRASEÑA",
      html: `<html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
              body {
                background-color: #333333;
                height: 100vh;
                font-family: 'Roboto', sans-serif;
                position: relative;
              }
              .container {
                max-width: 550px;
                width: 100%;
                heigth: 100%;
                margin: 30px auto;
              }
              .paragraph{
                  color: #4c4c4c;
              }
              .container p{
                  margin-bottom: 15px;
              }
              .container p{
                  font-size: 15px;
              }
              .wrapper{
                  padding: 0 15px;
              }
              .card {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 100%;
              }
              .link  {
                  border: 0;
                  background-color: #5cbb7b;
                  transition: all 0.3s ease-in;
                  cursor: pointer;
                  color: #fff !important;
                  padding: 10px 15px;
                  border-radius: 5px;
                  font-size: 18px;
                  text-decoration: none;
              }
              .link:hover {
                  background-color: #3da35f;
              }
              .spacing {
                  margin-top: 2rem
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="wrapper">
                  <div class="card">
                      <img style="width: 250px; margin-bottom: 10px;" src="https://i.postimg.cc/Y0k85mjt/logo.png" alt="InkhaSalud">
                      <h1 style="margin-bottom: 15px;" class="paragraph"><span style="color: #3da35f;">¡Hola!</span> ${name}</h1>
                      <p class="paragraph">Por favor, haga clic en el botón de abajo para restablecer su contraseña 😄</p>
                      <a class="link" href=${url}>
                         ${text}
                      </a>
                      <p class="spacing paragraph">
                          Si el botón de arriba no funciona, ingrese al enlace que se proporciona a continuación 👇🏻
                      </p>
                      <span style="word-wrap: break-word; font-size: 15px;">       
                         ${url}
                      </span>
              </div>
          </div>
      </body>
      </html>`
    };

    return await smtpTransport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmailRegister, sendEmailReset };
