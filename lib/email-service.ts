import nodemailer from "nodemailer"

// Настройка транспорта для отправки email
const createTransporter = () => {
  // Проверяем, включен ли режим пропуска отправки email
  if (process.env.SKIP_EMAIL_SENDING === "true") {
    console.log("Email sending is skipped in development mode")
    return null
  }

  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.yandex.ru",
      port: Number.parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "SCRating-sup@yandex.ru",
        pass: process.env.SMTP_PASSWORD || "prbzlaobkjjfjyry",
      },
    })
  } catch (error) {
    console.error("Failed to create email transporter:", error)
    return null
  }
}

export async function sendVerificationEmail(email: string, code: string) {
  try {
    const transporter = createTransporter()

    // Если мы в режиме разработки или не удалось создать транспорт, просто логируем и возвращаем успех
    if (!transporter) {
      console.log(`[DEV MODE] Would send verification code ${code} to ${email}`)
      return true
    }

    // В реальном приложении используйте HTML-шаблон
    const mailOptions = {
      from: process.env.EMAIL_FROM || "SCRating-sup@yandex.ru",
      to: email,
      subject: "Код подтверждения для регистрации",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Подтверждение регистрации</h2>
          <p>Спасибо за регистрацию на нашей платформе соревнований!</p>
          <p>Ваш код подтверждения: <strong style="font-size: 18px; background-color: #f5f5f5; padding: 5px 10px; border-radius: 3px;">${code}</strong></p>
          <p>Введите этот код на странице регистрации для завершения процесса.</p>
          <p>Если вы не запрашивали регистрацию, просто проигнорируйте это письмо.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">С уважением, команда платформы соревнований</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}
