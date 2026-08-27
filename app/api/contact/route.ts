export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { prisma } from "@near/cms-core/lib/prisma";

const contactSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  solutionDescription: z.string().min(1, "Solution description is required"),
  productCategory: z.string().min(1, "Product/category is required"),
  timeZone: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { companyName, contactName, email, phone, solutionDescription, productCategory, timeZone } = parsed.data;

  await (prisma as any).formSubmission.create({
    data: { formId: "fde-contact", data: parsed.data },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "near-ai-contact@aurora33.online",
    to: process.env.CONTACT_NOTIFICATION_EMAIL!,
    replyTo: email,
    subject: `[FDE Intake] New inquiry from ${contactName} at ${companyName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="margin-bottom: 8px;">New Forward Deployed Engineering Inquiry</h2>
        <hr style="border: none; border-top: 1px solid #f5f4f1; margin-bottom: 24px;" />

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #e1e1e1; width: 160px; vertical-align: top;">Company</td>
            <td style="padding: 8px 0; font-weight: 600;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #e1e1e1; vertical-align: top;">Contact</td>
            <td style="padding: 8px 0; font-weight: 600;">${contactName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #e1e1e1; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #e1e1e1; vertical-align: top;">Phone</td>
            <td style="padding: 8px 0;">${phone || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #e1e1e1; vertical-align: top;">Time Zone</td>
            <td style="padding: 8px 0;">${timeZone}</td>
          </tr>
        </table>

        <h3 style="margin-top: 24px; margin-bottom: 8px;">Solution Description</h3>
        <p style="color: #262626; background: #f5f4f1; padding: 16px; border-radius: 8px; margin: 0; white-space: pre-wrap;">${solutionDescription}</p>

        <h3 style="margin-top: 24px; margin-bottom: 8px;">Product / Category</h3>
        <p style="color: #262626; background: #f5f4f1; padding: 16px; border-radius: 8px; margin: 0;">${productCategory}</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
