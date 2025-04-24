module.exports = {
    apps: [
      {
        name: "fsp",
        cwd: "/var/www/fsp",
        script: "npm",
        args: "start",
        env_production: {
          NODE_ENV: "production",
          NEXTAUTH_SECRET: "9f3b2c4a8e7f5d1c6b0a9e8f5c3d2b1a4e6f7c8d9a0b1c2d3e4f5a6b7c8d9e0",
          SMTP_HOST: "smtp.yandex.ru",
          SMTP_PORT: "465",
          SMTP_SECURE: "true",
          SMTP_USER: "SCRating-sup@yandex.ru",
          SMTP_PASSWORD: "prbzlaobkjjfjyry",
          SMTP_FROM_ADDRESS: "no-reply@scrating.ru",
          SKIP_EMAIL_SENDING: "false",
          NEXT_PUBLIC_API_URL: "http://109.71.247.195/api"
        }
      }
    ]
  }
  