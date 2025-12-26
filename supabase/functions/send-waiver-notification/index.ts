import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PassengerInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  emergencyContact: string;
  emergencyPhone: string;
  isMinor: boolean;
}

interface WaiverData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  address: string;
  cityProvincePostal: string;
  emergencyContact: string;
  emergencyPhone: string;
  motorcycleMakeModel: string;
  licensePlate: string;
  licenseProvince: string;
  hasPassenger: boolean;
  isMinor: boolean;
  parentGuardianName?: string | null;
  passengerInfo?: PassengerInfo;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { waiverData }: { waiverData: WaiverData } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("VITE_NOTIFICATION_FROM_EMAIL") || "Vision & Valour <noreply@visionandvalour.ca>";
    const toEmails = Deno.env.get("VITE_NOTIFICATION_TO_EMAILS")?.split(",") || ["exec.director@visionandvalour.ca", "exec.director@motorcycletourism.ca"];

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const passengerSection = waiverData.hasPassenger && waiverData.passengerInfo ? `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #cbd5e0;">
        <h2 style="color: #1a365d; margin-bottom: 15px; font-size: 20px;">Passenger Information</h2>
        
        <div class="field">
          <div class="label">Passenger Name:</div>
          <div class="value">${waiverData.passengerInfo.fullName}</div>
        </div>
        
        <div class="field">
          <div class="label">Passenger Date of Birth:</div>
          <div class="value">${waiverData.passengerInfo.dateOfBirth} (Age: ${waiverData.passengerInfo.age})</div>
        </div>
        
        <div class="field">
          <div class="label">Passenger Email:</div>
          <div class="value">${waiverData.passengerInfo.email}</div>
        </div>
        
        <div class="field">
          <div class="label">Passenger Phone:</div>
          <div class="value">${waiverData.passengerInfo.phone}</div>
        </div>
        
        <div class="field">
          <div class="label">Passenger Emergency Contact:</div>
          <div class="value">${waiverData.passengerInfo.emergencyContact} - ${waiverData.passengerInfo.emergencyPhone}</div>
        </div>
        
        ${waiverData.passengerInfo.isMinor ? `
        <div class="field">
          <div class="label" style="color: #c53030;">⚠️ Minor Status:</div>
          <div class="value" style="color: #c53030; font-weight: bold;">Passenger is under 18 - Parent/Guardian consent required</div>
        </div>
        ` : ''}
      </div>
    ` : '';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2d3748; margin: 0; padding: 0; background-color: #f7fafc; }
            .container { max-width: 700px; margin: 20px auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .header p { margin: 10px 0 0 0; opacity: 0.95; font-size: 16px; }
            .content { padding: 30px; }
            .alert { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 4px; }
            .alert-text { color: #92400e; font-weight: 600; margin: 0; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #1a365d; margin-bottom: 15px; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            .field { margin-bottom: 15px; padding: 12px; background-color: #f7fafc; border-radius: 6px; }
            .label { font-weight: 700; color: #2d3748; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
            .value { color: #4a5568; font-size: 15px; }
            .footer { background-color: #f7fafc; padding: 20px; text-align: center; color: #718096; font-size: 13px; border-top: 1px solid #e2e8f0; }
            .badge { display: inline-block; padding: 4px 12px; background-color: #c53030; color: white; border-radius: 12px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏍️ New Waiver Submission</h1>
              <p>Ride for Vision & Valour 2026</p>
            </div>
            
            <div class="content">
              <div class="alert">
                <p class="alert-text">⚠️ A new waiver has been submitted and requires review</p>
              </div>
              
              <div class="section">
                <h2>Rider Information</h2>
                
                <div class="field">
                  <div class="label">Full Name:</div>
                  <div class="value">${waiverData.fullName}</div>
                </div>
                
                <div class="field">
                  <div class="label">Date of Birth:</div>
                  <div class="value">${waiverData.dateOfBirth} (Age: ${waiverData.age})</div>
                </div>
                
                ${waiverData.isMinor ? `
                <div class="field">
                  <div class="label" style="color: #c53030;">⚠️ Minor Status:</div>
                  <div class="value" style="color: #c53030; font-weight: bold;">Rider is under 18 - Parent/Guardian: ${waiverData.parentGuardianName}</div>
                </div>
                ` : ''}
                
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${waiverData.email}" style="color: #3182ce; text-decoration: none;">${waiverData.email}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${waiverData.phone}" style="color: #3182ce; text-decoration: none;">${waiverData.phone}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">Address:</div>
                  <div class="value">${waiverData.address}<br>${waiverData.cityProvincePostal}</div>
                </div>
              </div>
              
              <div class="section">
                <h2>Emergency Contact</h2>
                
                <div class="field">
                  <div class="label">Emergency Contact Name:</div>
                  <div class="value">${waiverData.emergencyContact}</div>
                </div>
                
                <div class="field">
                  <div class="label">Emergency Contact Phone:</div>
                  <div class="value"><a href="tel:${waiverData.emergencyPhone}" style="color: #c53030; text-decoration: none; font-weight: 600;">${waiverData.emergencyPhone}</a></div>
                </div>
              </div>
              
              <div class="section">
                <h2>Motorcycle Information</h2>
                
                <div class="field">
                  <div class="label">Make/Model:</div>
                  <div class="value">${waiverData.motorcycleMakeModel}</div>
                </div>
                
                <div class="field">
                  <div class="label">License Plate:</div>
                  <div class="value">${waiverData.licensePlate} (${waiverData.licenseProvince})</div>
                </div>
              </div>
              
              ${passengerSection}
              
              <div style="margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #2d3748; font-size: 14px;"><strong>Submission Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton', dateStyle: 'full', timeStyle: 'long' })}</p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">This is an automated notification from the Vision & Valour website</p>
              <p style="margin: 5px 0 0 0;">Please log in to the admin panel to view complete waiver details</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmails,
        subject: `🏍️ New Waiver - ${waiverData.fullName}${waiverData.hasPassenger ? ' + Passenger' : ''}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      throw new Error(`Resend API error: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});