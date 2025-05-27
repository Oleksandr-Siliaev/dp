// app/api/submit-test/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    if (!data.title || !data.questions) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Новий тест на модерацію',
      text: `Дані тесту:\n${JSON.stringify(data, null, 2)}`,
      html: `
        <h1>Новий тест відправлено на модерацію</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `
    }

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