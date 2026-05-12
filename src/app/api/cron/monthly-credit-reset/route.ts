import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/cron/monthly-credit-reset
 * 
 * Scheduled via Vercel Cron to run at 29 18 * * * (11:59 PM IST daily).
 * Determines if today in IST is the last day of the month.
 * If yes, it wipes all credits and grants 50 credits to active Plan 2 users.
 */
export async function GET(req: Request) {
  try {
    // 1. Verify Vercel Cron Secret (optional but recommended for security)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Check if today is the last day of the month in IST
    const now = new Date();
    // Format the date in IST
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    
    // Parse the IST date components from the formatted string
    const istDateString = formatter.format(now);
    const [monthStr, dayStr, yearStr] = istDateString.split('/');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // 0-indexed
    const day = parseInt(dayStr, 10);

    const currentDateInIST = new Date(year, month, day);

    // Get the last day of the current month in IST
    // month + 1 with day 0 gives the last day of the current month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    if (day !== lastDayOfMonth) {
      return NextResponse.json({
        status: "skipped",
        message: `Today (IST ${day}/${month + 1}/${year}) is not the last day of the month (${lastDayOfMonth}). Cron skipped.`
      });
    }

    console.log(`[CRON] Executing monthly credit reset for IST ${day}/${month + 1}/${year}`);

    // 3. Update all user credits
    // Active Plan 2 users get 50 credits.
    // Everyone else (including Plan 1, Promo, or inactive/failed Plan 2) gets 0 credits.
    const { error } = await supabaseAdmin.rpc('reset_monthly_credits');

    if (error) {
      console.error("[CRON] RPC reset_monthly_credits failed. Ensure the migration has been applied.", error);
      throw error;
    }

    return NextResponse.json({
      status: "success",
      message: "Monthly credits successfully reset."
    });

  } catch (err: any) {
    console.error("[CRON] monthly-credit-reset error:", err);
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 });
  }
}
