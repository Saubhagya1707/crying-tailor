import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.RESEND_FROM ?? "Resume Tailor <cryingtailor@resend.dev>";

/**
 * Sends a verification email with a link to verify the user's email address.
 */
export async function sendVerificationEmail(
  to: string,
  verificationUrl: string
): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject: "Verify your email – Resume Tailor",
      html: `
        <p>Thanks for signing up for Resume Tailor.</p>
        <p>Click the link below to verify your email and activate your account:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't create an account, you can ignore this email.</p>
      `,
    });
    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: new Error(error.message) };
    }
    return { success: true };
  } catch (e) {
    console.error("Send verification email error:", e);
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Failed to send email"),
    };
  }
}
