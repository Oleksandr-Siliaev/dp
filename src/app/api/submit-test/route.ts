// app/api/submit-test/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Валидация данных
    if (!data.title || !data.questions) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    // Конфигурация транспорта
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    // Формирование письма
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Новый тест на модерацию',
      text: `Данные теста:\n${JSON.stringify(data, null, 2)}`,
      html: `
        <h1>Новый тест отправлен на модерацию</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `
    }

    // Отправка
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Submit test error:', error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}