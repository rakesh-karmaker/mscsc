// team confirmation email draft
export interface TeamRegistrationConfirmationDraftProps {
  eventName: string;
  logoUrl: string;
  name: string;
  segmentName: string;
  teamName: string;
  leaderEmail: string;
  memberEmails: string[];
}

export function teamRegistrationConfirmationDraft({
  eventName,
  logoUrl,
  name,
  teamName,
  leaderEmail,
  memberEmails,
  segmentName,
}: TeamRegistrationConfirmationDraftProps) {
  const year = new Date().getFullYear();
  return `
        <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${eventName} Team Registration Confirmation</title>
</head>

<body
    style="margin:0; background-color: #e9dede00; box-sizing: border-box; font-family: 'Poppins', Arial, sans-serif; color: #1d4b52;">
    <center class="wrapper">
        <table class="main"
            style="width: 100%; max-width: 568px; background-color: #fff8ec; height: 100%; border-spacing: 0;">
            <tr>
                <td style="width: 100%; padding: 0;">
                    <table class="top" style="border-spacing: 0;width: 100%; height: 100%; background-color: #fff8ec;">
                        <tr>
                            <td>
                                <center>
                                    <img src="https://ik.imagekit.io/mscsc/events/email-template-image_RxYMeUhXs.png" alt="banner"
                                        style="width: 100%; height: 100%; margin: 0; padding: 0;">
                                </center>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2
                                    style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 20px; color: #1d4b52;">
                                    Team Registration Confirmed!
                                </h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <center>
                                    <img src="${logoUrl}" alt="logo"
                                        style="width: 200px; height: 200px; margin: 0; padding: 0; object-fit: cover; object-position: center;">
                                </center>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <center>
                                    <p
                                        style="margin: 10px 0 0px 0; padding: 0 10px; font-size: 20px; max-width: 90%; text-align: center; color: #1d4b52; opacity: 0.8;">
                                        Your team details for the event have been received successfully.
                                    </p>
                                </center>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td style="width: 100%; padding: 0; border: 3px solid #fff8ec;">
                    <table class="id-c" style="border-spacing: 0; width: 100%; height: 100%;">
                        <tr>
                            <td>
                                <h2
                                    style="margin: 0; padding: 0 20px; font-size: 28px; font-weight: 500; line-height: 36px; letter-spacing: 0.01em; text-align: center; margin-top: 18px; color: #1d4b52;">
                                    Team Details for <span style="font-weight: 600;">${teamName}</span>
                                </h2>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 14px 24px 20px 24px;">
                                <table
                                    style="width: 100%; border-spacing: 0; background-color: #fff1da; border: 2px solid #043841; border-radius: 5px;">
                                    <tr>
                                        <td style="padding: 16px 18px;">
                                            <p style="margin: 0 0 10px 0; font-size: 16px; color: #043841;">
                                                <strong>Event:</strong> ${eventName}
                                            </p>
                                            <p style="margin: 0 0 10px 0; font-size: 16px; color: #043841;">
                                                <strong>Segment:</strong> ${segmentName}
                                            </p>
                                            <p style="margin: 0 0 10px 0; font-size: 16px; color: #043841;">
                                                <strong>Team Name:</strong> ${teamName}
                                            </p>
                                            <p style="margin: 0 0 10px 0; font-size: 16px; color: #043841;">
                                                <strong>Leader Email:</strong> ${leaderEmail}
                                            </p>
                                            <p style="margin: 0 0 6px 0; font-size: 16px; color: #043841;">
                                                <strong>Member Emails:</strong>
                                            </p>
                                            <ul style="margin: 0; padding-left: 20px; color: #043841;">
                                                ${memberEmails.map(
                                                  (email) =>
                                                    `<li style="font-size: 16px; margin-bottom: 4px;">${email}</li>`,
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr>
                <td>
                    <h2
                        style="margin: 0; padding: 0 20px; font-size: 30px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 8px; margin-bottom: 20px; color: #1d4b52;">
                        Best of luck, ${name}!
                    </h2>
                </td>
            </tr>

            <tr>
                <td>
                    <center>
                        <table style="width: 95%; padding: 0; border-top: 3px solid rgba(0, 0, 0, 0.336);">
                            <tr>
                                <td>
                                    <h2
                                        style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 20px; color: #1d4b52;">
                                        <span style="color: #043841;">Questions?</span> Contact Us!
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <center>
                                        <p
                                            style="margin: 10px 0 5px 0; padding: 0 20px; font-size: 16px; max-width: 400px; text-align: center; color: #1d4b52; opacity: 0.8;">
                                            Reach us on social media or email us at
                                            <a href="mailto:mscscofficial17@gmail.com"
                                                style="color: #1d4b52; text-decoration: underline;">
                                                mscscofficial17@gmail.com
                                            </a>
                                        </p>
                                    </center>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <center>
                                        <table class="footer" style="border-spacing: 0;">
                                            <tr>
                                                <td>
                                                    <center>
                                                        <p style="margin-bottom: 30px;">
                                                            <a href="https://www.facebook.com/MSCSC2014"
                                                                style="text-decoration: none; text-align: center; font-size: 17px; color: #1d4b52; margin: 10px 11px;">Facebook</a>

                                                            <span
                                                                style="font-size: 30px; font-weight: 400; color: #043841; margin: 0;">|</span>

                                                            <a href="https://mscsc.netlify.app/"
                                                                style="text-decoration: none; text-align: center; font-size: 17px; color: #1d4b52; margin: 10px 11px;">Website</a>

                                                            <span
                                                                style="font-size: 30px; font-weight: 400; color: #043841; margin: 0;">|</span>

                                                            <a href="https://www.instagram.com/_mscsclub_/"
                                                                style="text-decoration: none; text-align: center; font-size: 17px; color: #1d4b52; margin: 10px 11px;">Instagram</a>
                                                        </p>
                                                    </center>
                                                </td>
                                            </tr>
                                        </table>
                                    </center>
                                </td>
                            </tr>
                        </table>
                    </center>
                </td>
            </tr>

            <tr>
                <td style="width: 100%; background-color: #043841; padding: 20px 0px; padding-top: 30px;">
                    <center>
                        <table class="footer" style="border-spacing: 0;">
                            <tr>
                                <td>
                                    <center>
                                        <p
                                            style="text-align: center; margin-top: 5px; padding: 0; font-size: 15px; color: rgba(255, 255, 255, 0.863); max-width: 400px;">
                                            © ${year} <a href="https://mscsc.netlify.app/"
                                                style="text-decoration: none; text-align: center; color: rgba(255, 255, 255, 0.795);">MSCSC</a>
                                            || All Rights Reserved
                                        </p>
                                    </center>
                                </td>
                            </tr>
                        </table>
                    </center>
                </td>
            </tr>
        </table>
    </center>
</body>

</html>
        `;
}
